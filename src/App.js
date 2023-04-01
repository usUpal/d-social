import { useEffect, useState } from 'react';
import {
  LENS_HUB_CONTRACT_ADDRESS,
  queryExplorePublications, queryRecommandedProfiles, urlClient
} from './queries';
import { ethers } from 'ethers';
import LENSHUB from './lenshub.json'
import { Box } from '@chakra-ui/react';
function App() {
  const [account, setAccount] = useState(null);
  const [profiles, setProfiles] = useState([]);
  const [posts, setPosts] = useState([]);

  async function signIn(){
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    })
    setAccount(accounts[0]);
  };
  async function getRecommendadProfiles(){
    const response = await urlClient
      .query(queryRecommandedProfiles)
      .toPromise();
    const profiles = response.data.recommendadProfiles.slice(0,5);
    setProfiles(profiles);
  }
  async function getPosts(){
    const response = await urlClient.query(queryExplorePublications).toPromise();
    
    const posts = response.data.explorePublications.items.filter((post)=>{
      if(post.profile) return post;
      return ""
    })
    setPosts(posts);
  }
  async function follow(id){
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const contract = new ethers.Contract(LENS_HUB_CONTRACT_ADDRESS, LENSHUB,provider.getSigner() )
    const tx = await contract.follow([parseInt(id)],[0*0])
    await tx.wait()
  }
  useEffect(()=>{
    getRecommendadProfiles();
    getPosts();
  },[])
  return (
    <div className="app">
      <Box>
        
      </Box>
    </div>
  );
}

export default App;
