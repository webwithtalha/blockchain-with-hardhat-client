import { useState } from "react";
import styles from "../styles/Home.module.css";
import { ethers } from "ethers";
import GreeterABI from "../web3/abis/Greeter.json";
import { Addresses } from "../web3/addresses/contracts";

export default function Home() {
  const [greeting, setGreetingValue] = useState("");

  const requestAccount = async () => {
    if (window.ethereum) {
      await window.ethereum.request?.({ method: "eth_requestAccounts" });
    }
  };

  const fetchGreeting = async () => {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        Addresses.Greeter[97],
        GreeterABI,
        provider
      );
      try {
        const data = await contract.greet();
        console.log("data: ", data);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  };

  const setGreeting = async () => {
    if (!greeting) return;
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        Addresses.Greeter[97],
        GreeterABI,
        signer
      );
      const transaction = await contract.setGreeting(greeting);
      setGreetingValue("");
      await transaction.wait();
      fetchGreeting();
    }
  };

  return (
    <div className={styles.container}>
      <button onClick={fetchGreeting}>Fetch Greeting</button>
      <button onClick={setGreeting}>Set Greeting</button>

      <input
        onChange={(e) => setGreetingValue(e.target.value)}
        placeholder="Set greeting"
      />
    </div>
  );
}
