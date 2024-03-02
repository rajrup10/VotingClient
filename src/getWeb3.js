import Web3 from "web3";
export const getWeb3=async()=>{
    if(window.ethereum){
      window.web3=new Web3(window.ethereum);
      await window.ethereum.enable();
      return window.web3;
    }
    else if(window.web3){
      window.web3=new Web3(window.web3.currentProvider);
      console.log("Injected web3 detected");
      return window.web3;
    }
    else{
      console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }