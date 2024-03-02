import React, { useEffect, useState } from 'react';
import { getWeb3 } from '../../../getWeb3';
import AdminOnly from '../../AdminOnly';
import Navbar from '../../Navbar/Navbar';
import Election from '../../../contracts/Election.json';
import NavbarAdmin from '../../Navbar/NavbarAdmin';
import "./AddCandidate.css"
function AddCandidate() {
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState(null);
    const [electionInstance, setElectionInstance] = useState(undefined);
    const [isAdmin, setIsAdmin] = useState(false);
    const [header, setHeader] = useState("");
    const [slogan, setSlogan] = useState("");
    const [candidates, setCandidates] = useState([]);
    const [candidateCount, setCandidateCount] = useState(undefined);

    useEffect(() => {
        const addCan = async () => {
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

                const candidateCount = await instance.methods.getTotalCandidate().call();
                setCandidateCount(candidateCount);

                const admin = await instance.methods.getAdmin().call();
                if (accounts[0] === admin) {
                    setIsAdmin(true);
                }

                for (let i = 0; i < candidateCount; i++) {
                    const candidate = await instance.methods.candidateDetails(i).call();
                    candidates.push({
                        id: candidate.candidateId,
                        header: candidate.header,
                        slogan: candidate.slogan,
                    });
                    setCandidates(candidates);
                }

            } catch (error) {
                alert(
                    `Failed to load web3, accounts, or contract. Check console for details.`
                );
                console.error(error);
            }
        };
        addCan();
    }, []);
    //console.log(candidates);

    const updateHeader = (event) => {
        setHeader(event.target.value);
    };

    const updateSlogan = (event) => {
        setSlogan(event.target.value);
    };

    const addCandidate = async () => {
        await electionInstance.methods.addCandidate(header, slogan).send({ from: account, gas: 1000000 });
        window.location.reload();
    };

    const loadAdded = (candidates) => {
        const renderAdded = (candidate) => {
            console.log(candidate);
            return (
                <>
                    <div className="container-list success">
                        <div
                            style={{
                                maxHeight: "21px",
                                overflow: "auto",
                            }}
                        >
                            {candidate.id}. <strong>{candidate.header}</strong>:{" "}
                            {candidate.slogan}
                        </div>
                    </div>
                </>
            );
        }
        return(
            <div className="container-main" style={{ borderTop: "1px solid" }}>
            <div className="container-item info">
              <center>Candidates List</center>
            </div>
            {candidates.length < 1 ? (
              <div className="container-item alert">
                <center>No candidates added.</center>
              </div>
            ) : (
              <div
                className="container-item"
                style={{
                  display: "block",
                  backgroundColor: "#DDFFFF",
                }}
              >
                {candidates.map(renderAdded)}
              </div>
            )}
          </div>
        );
    }

    if (!isAdmin) {
        return (
            <>
                <Navbar />
                <AdminOnly page="Add Candidate Page." />
            </>
        );
    }
    return (
        <>
            <NavbarAdmin />
            <div className="container-main">
                <h2>Add a new candidate</h2>
                <small>Total candidates: {candidateCount}</small>
                <div className="container-item">
                    <form className="form">
                        <label className={"label-ac"}>
                            Header
                            <input
                                className={"input-ac"}
                                type="text"
                                placeholder="eg. Marcus"
                                value={header}
                                onChange={updateHeader}
                            />
                        </label>
                        <label className={"label-ac"}>
                            Slogan
                            <input
                                className={"input-ac"}
                                type="text"
                                placeholder="eg. It is what it is"
                                value={slogan}
                                onChange={updateSlogan}
                            />
                        </label>
                        <button
                            className="btn-add bg-cyan-800 text-white"
                            disabled={
                                header.length < 3 || header.length > 21
                            }
                            onClick={addCandidate}
                        >
                            Add
                        </button>
                    </form>
                </div>
            </div>
            {loadAdded(candidates)}
        </>
    );

}

export default AddCandidate