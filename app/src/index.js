import Web3 from "web3";
import starNotaryArtifact from "../../build/contracts/StarNotary.json";


const App = {
  web3: null,
  account: null,
  meta: null,

  start: async function() {
      const { web3 } = this;

      try {
          const networkId = await web3.eth.net.getId();
          const deployedNetwork = starNotaryArtifact.networks[networkId];
          this.meta = new web3.eth.Contract(starNotaryArtifact.abi, deployedNetwork.address);

          const accounts = await web3.eth.getAccounts();
          this.account = accounts[0];

      } catch (e) {
          console.log('Could not connect to contract or chain.');
      }
  },

  setStatus: function(message) {
      const statusMessage = document.getElementById("status");
      statusMessage.innerHTML = message;
  },

  createStar: async function() {
      const { createStar } = this.meta.methods;
      const name = document.getElementById("starName").value;
      const starId = document.getElementById("starId").value;

      await createStar(name, starId).send({from: this.account});

      App.setStatus("New star owner is " + this.account);
  }


};

window.App = App;

window.addEventListener("load", async function() {
    if (window.ethereum) {
        // use MetaMask's provider
        App.web3 = new Web3(window.ethereum);
        await window.ethereum.enable(); // get permission to access accounts
    } else {
        console.warn("No web3 detected. Falling back to http://127.0.0.1:9545. You should remove this fallback when you deploy live",);
        // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
        App.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"),);
    }

    App.start();
});
