import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import UserHome from './UserHome';
import StartEnd from './StartEnd';
import ElectionStatus from './ElectionStatus';
import { getWeb3 } from '../getWeb3';
import Election from '../contracts/Election.json';
import Navbar from './Navbar/Navbar';
import NavbarAdmin from './Navbar/NavbarAdmin';

import "./Home.css";
import { Link } from 'react-router-dom';
function Home() {
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState(null);
    const [electionInstance, setElectionInstance] = useState(undefined);
    const [isAdmin, setIsAdmin] = useState(false);
    const [elStart, setElStart] = useState(false);
    const [elEnded, setElEnded] = useState(false);
    const [electionDetails, setElectionDetails] = useState({});
    
    
    useEffect(() => {
        const fetch = async () => {
            if (!window.location.hash) {
                window.location = window.location + "#loaded";
                window.location.reload();
            }
            try {
                const web3 = await getWeb3();
                const accounts = await web3.eth.getAccounts();
                setWeb3(web3);
                setAccount(accounts[0]);

                const networkId = await web3.eth.net.getId();
                const deployedNetwork = Election.networks[networkId];
                const instance = new web3.eth.Contract(
                    Election.abi,
                    deployedNetwork && deployedNetwork.address
                );
                setElectionInstance(instance);

                const admin = await instance.methods.getAdmin().call();
                if (accounts[0] === admin) {
                    setIsAdmin(true);
                }
                const start = await instance.methods.getStart().call();
                setElStart(start);
                const end = await instance.methods.getStart().call();
                setElEnded(end);

                const electionDetails = await instance.methods.getElectionDetails().call();
                setElectionDetails({
                    elDetails: {
                        adminName: electionDetails.adminName,
                        adminEmail: electionDetails.adminEmail,
                        adminTitle: electionDetails.adminTitle,
                        electionTitle: electionDetails.electionTitle,
                        organizationTitle: electionDetails.organizationTitle,
                    },
                });
            } catch (error) {
                alert(
                    `Failed to load web3, accounts, or contract. Check console for details.`
                );
                console.error(error);
            }
        }
        fetch();
    }, []);

    const endElection = async () => {
        await electionInstance.methods.endElection().send({ from: account, gas: 1000000 });
        window.location.reload();
    }

    const registerElection = async (data) => {
        await electionInstance.methods.setElectionDetails(
            data.adminFName.toLowerCase() + " " + data.adminLName.toLowerCase(),
            data.adminEmail.toLowerCase(),
            data.adminTitle.toLowerCase(),
            data.electionTitle.toLowerCase(),
            data.organizationTitle.toLowerCase()
        ).send({ from: account, gas: 1000000 });
        window.location.reload();
    }


    const RenderAdminhome = () => {
        const EMsg = (props) => {
            return <span style={{ color: "tomato" }}>{props.msg}</span>
        };

        const AdminHome = () => {
            const { handleSubmit, register, formState: { errors }, } = useForm();
            const onSubmit = (data) => {
                registerElection(data);
            }
            return (
                <div>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {!elStart & !elEnded ? (
                            <div className='container-main'>
                                <div className='about-admin'>
                                    <h3 className='text-white font-bold text-lg text-center'>About Admin</h3>
                                    <div className='container-item center-items'>
                                        <div>
                                            <label className='label-home'>
                                                Full Name{" "}
                                                {errors.adminFName && <EMsg msg="*required" />}
                                                <input className='input-home' type='text' placeholder='First Name' {...register("adminFName", { required: true })} />
                                                <input
                                                    className="input-home"
                                                    type="text"
                                                    placeholder="Last Name"
                                                    {...register("adminLName")}
                                                />
                                            </label>

                                            <label className="label-home">
                                                Email{" "}
                                                {errors.adminEmail && (
                                                    <EMsg msg={errors.adminEmail.message} />
                                                )}
                                                <input
                                                    className="input-home"
                                                    placeholder="eg. you@example.com"
                                                    name="adminEmail"
                                                    {...register("adminEmail", {
                                                        required: "*Required",
                                                        pattern: {
                                                            value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/, // email validation using RegExp
                                                            message: "*Invalid",
                                                        },
                                                    })}
                                                />
                                            </label>

                                            <label className="label-home">
                                                Job Title or Position{" "}
                                                {errors.adminTitle && <EMsg msg="*required" />}
                                                <input
                                                    className="input-home"
                                                    type="text"
                                                    placeholder="eg. HR Head "
                                                    {...register("adminTitle", {
                                                        required: true,
                                                    })}
                                                />
                                            </label>

                                        </div>
                                    </div>
                                </div>
                                <div className="about-election">
                                    <h3 className='text-white font-bold text-lg text-center'>About Election</h3>
                                    <div className="container-item center-items">
                                        <div>
                                            <label className="label-home">
                                                Election Title{" "}
                                                {errors.electionTitle && <EMsg msg="*required" />}
                                                <input
                                                    className="input-home"
                                                    type="text"
                                                    placeholder="eg. School Election"
                                                    {...register("electionTitle", {
                                                        required: true,
                                                    })}
                                                />
                                            </label>
                                            <label className="label-home">
                                                Organization Name{" "}
                                                {errors.organizationName && <EMsg msg="*required" />}
                                                <input
                                                    className="input-home"
                                                    type="text"
                                                    placeholder="eg. Lifeline Academy"
                                                    {...register("organizationTitle", {
                                                        required: true,
                                                    })}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <div className="about-election">
                                    <h3 className='text-white font-bold text-lg text-center'>About Election</h3>
                                    <div className="container-item center-items">
                                        <div>
                                            <label className="label-home">
                                                Election Title{" "}
                                                {errors.electionTitle && <EMsg msg="*required" />}
                                                <input
                                                    className="input-home"
                                                    type="text"
                                                    placeholder="eg. School Election"
                                                    {...register("electionTitle", {
                                                        required: true,
                                                    })}
                                                />
                                            </label>
                                            <label className="label-home">
                                                Organization Name{" "}
                                                {errors.organizationName && <EMsg msg="*required" />}
                                                <input
                                                    className="input-home"
                                                    type="text"
                                                    placeholder="eg. Lifeline Academy"
                                                    {...register("organizationTitle", {
                                                        required: true,
                                                    })}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        ) : elStart ? (
                            <UserHome el={electionDetails} />
                        ) : null}
                        <StartEnd elStarted={elStart} elEnded={elEnded} endElFn={endElection} />
                        <ElectionStatus elStarted={elStart} elEnded={elEnded} />
                    </form>
                </div>
            );
        }
        return <AdminHome />
    }


    if (!web3) {
        return (
            <>
                <Navbar />
                <center>Loading Web3, accounts, and contract...</center>
            </>
        );
    }
    return (
        <div className='bg-gradient-to-br from-gray-900 to-gray-500'>
            {isAdmin ? <NavbarAdmin /> : <Navbar />}
            <div className='container-main'>
                <div className='container-item center-items info bg-emerald-600 text-slate-300'>
                    Your Account : {account}
                </div>
                {!elStart & !elEnded ? (
                    <div className='container-item info bg-emerald-600 text-slate-300'>
                        <center>
                            <h3>The election has not been initialize.</h3>
                            {isAdmin ? (
                                <p>Set up the election.</p>
                            ) : (
                                <p>Please wait..</p>
                            )}
                        </center>
                    </div>
                ) : null}
            </div>
            {isAdmin ? (
                    <RenderAdminhome/>
            ): elStart ? (
                <UserHome el={electionDetails}/>
            ) : !elStart && elEnded ? (
                <div className="container-item attention">
              <center>
                <h3>The Election ended.</h3>
                <br />
                <Link
                  to="/Results"
                  style={{ color: "black", textDecoration: "underline" }}
                >
                  See results
                </Link>
              </center>
            </div>
            ):null}
        </div>
    );
}



export default Home;
