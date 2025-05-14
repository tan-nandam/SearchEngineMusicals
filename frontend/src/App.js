import './App.css';
// import {useState} from 'react';
// import { TextField, Box, Button, Radio, RadioGroup, FormControlLabel, Typography } from '@mui/material';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogContentText from '@mui/material/DialogContentText';
// import DialogTitle from '@mui/material/DialogTitle';
// import { Card, CardContent } from '@material-ui/core';
// import axios from 'axios';
// import logo from './logo.png';
// import { google } from 'googleapis';

import { useState } from 'react';
import { TextField, Box, Button, Radio, RadioGroup, FormControlLabel, Typography, Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import axios from 'axios';
import logo from './logo_1.png';
import ResultsModal from './ResultsModal';
import { Tooltip } from '@mui/material';


// import { google } from 'googleapis';



function App() {
    const sampleData = [
        //{ id: '1', title: 'Document 1', url: 'http://example.com/document1', meta_info: 'Some meta info', anchor: ['anchor1', 'anchor2'], rank: '2' },
        //{ id: '2', title: 'Document 2', url: 'http://example.com/document2', meta_info: 'Some meta info', anchor: ['anchor3', 'anchor4'], rank: '1' },
        //{ id: '3', title: 'Document 3', url: 'http://example.com/document3', meta_info: 'Some meta info', anchor: ['anchor5', 'anchor6'], rank: '3' },
      ];

  const [value, setValue] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [queryExpandValue, setQueryExpandValue] = useState('');
  const [queryExpand, setQueryExpand] = useState(false);
  const [queryDisabled, setQueryDisabled] = useState(false);
  const [clusterDisabled, setClusterDisabled] = useState(false);
  const [final_data, setFinalData] = useState(sampleData);
//  const [final_data_google, setFinalDataGoogle] = useState(sampleData);
//  const [final_data_bing, setFinalDataBing] = useState(sampleData);
  const [open, setOpen] = useState(false);

  const iframeBingSrc = `https://www.bing.com/search?q=${value}`;
  // const iframeGoogleSrc = `https://www.google.com/search?q=${value}`;
  // const iframeGoogleSrc = `https://www.googleapis.com/customsearch/v1?key=AIzaSyAB7Gk6x6Gn6PRZgLA51MzpKMLrpWDVTV4&cx=c4783c2b38a034b23&q=${value}`;
  

  const handleClear = async e => {
    setValue('');
    setFinalData([]);
    setShowResult(false);
    setQueryDisabled(false);
    setClusterDisabled(false);

  }

  const handleHelp = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [radioValue, setRadioValue] = useState('page_ranking');
  const [radioRestValue, setRestRadioValue] = useState('');
  const [googleResults, setGoogleResults] = useState([]);

  const handleRestRadioChange = (event) => {
    setRestRadioValue(event.target.value);
  }

  const handleRadioChange = (event) => {
    setRadioValue(event.target.value);
    if (event.target.value === 'hits') {
        setQueryDisabled(true);
        setClusterDisabled(true);
    } else {
        setQueryDisabled(false);
        setClusterDisabled(false);
    }
  };
  
  const handleTextInput = (v) => {
    setValue(v.target.value);
  }

 

  // const handleSearch = async (query) => {
  //   try {
  //     const customsearch = google.customsearch('v1');
  //     const res = await customsearch.cse.list({
  //       auth: 'AIzaSyAB7Gk6x6Gn6PRZgLA51MzpKMLrpWDVTV4',
  //       cx: 'c4783c2b38a034b23',
  //       q: query,
  //     });

  //     setSearchResults(res.data.items);
  //   } catch (error) {
  //     console.error('Error fetching search results:', error);
  //   }
  // }

  // const handleTextInputChange = async e => {
  //   if(value.length == 0) {
  //       alert("Input cannot be empty, Please enter a non-empty string!")
  //       return
  //   }
  //   let obj = {"config": radioValue, "rest": radioRestValue, "query":value}
  //   const response = await fetch(`http://127.0.0.1:5000/api/search`, {
  //           method: 'POST',
  //           crossDomain:true,
  //           headers: {'Content-Type': 'application/json'},
  //           body: JSON.stringify(obj)
  //         })
  //   const result = await response.json()
  //         console.log(result.result.expanded_query)
  //         console.log(result.result.results)
    
  //   if (Boolean(result.result.expanded_query) || result.result.expanded_query!== '') {
  //       setQueryExpand(true)
  //       setQueryExpandValue(result.result.expanded_query)
  //   }
  //   // Sort the documents by rank
  //   setFinalData(result.result.results)
  //   final_data.sort((a, b) => a.rank - b.rank);
  //   setShowResult(true);
  // }
  const handleTextInputChange = async e => {
    if (value.length === 0) {
        alert("Input cannot be empty, Please enter a non-empty string!");
        return;
    }
    let obj = { "config": radioValue, "rest": radioRestValue, "query": value };

    // Fetch results from local API
    const response = await fetch(`http://127.0.0.1:5000/api/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(obj)
    });
    const result = await response.json();

    if (Boolean(result.result.expanded_query) || result.result.expanded_query !== '') {
        setQueryExpand(true);
        setQueryExpandValue(result.result.expanded_query);
    }
    // Sort the documents by rank
    setFinalData(result.result.results);
    setShowResult(true);

    // Fetch from Google Custom Search
    try {
        const googleResponse = await axios.get(`https://www.googleapis.com/customsearch/v1`, {
            params: {
                key: 'AIzaSyBolB7G1dlNvoeCDplghmqVbrgLSJ3McRQ',  // Replace 'YOUR_API_KEY' with your actual API key
                cx: '62f7209c8b7db4c45',    // Replace 'YOUR_CSE_ID' with your custom search engine ID
                q: value
            }
        });
        setGoogleResults(googleResponse.data.items);  // Update state with results from Google
    } catch (error) {
        console.error('Error fetching search results from Google:', error);
        setGoogleResults([]);  // Clear previous results or handle error
    }
};


  return (
    <div className="App">
      {/*<p>
        <code>Dive Search Engine</code>
      </p>*/}
<header className="App-header">
  {/* NAVBAR */}
  <Box
  sx={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#eaeaea',
    padding: '12px 24px',
    borderRadius: '12px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
    marginBottom: 3,
    flexWrap: 'wrap',
    gap: 2,
  }}
>
  {/* Logo */}
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <img src={logo} alt="logo" style={{ height: '40px' }} />
  </Box>

  {/* Search Box + Button */}
  <Box
    sx={{
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      backgroundColor: '#fff',
      borderRadius: '20px',
      padding: '4px 12px',
      boxShadow: 'inset 0 0 4px rgba(0,0,0,0.1)',
    }}
  >
    <TextField
      variant="standard"
      placeholder="Search musicals, artists, anything..."
      InputProps={{
        disableUnderline: true,
        style: {
          paddingLeft: 8,
        },
      }}
      fullWidth
      value={value}
      onChange={handleTextInput}
    />
    <Button
      variant="contained"
      onClick={handleTextInputChange}
      sx={{
        borderRadius: '20px',
        textTransform: 'none',
        fontWeight: 500,
      }}
    >
      Search
    </Button>
  </Box>

  <Tooltip title="Contact Developer" arrow placement="bottom">
  <Box
    onClick={handleHelp}
    sx={{
      backgroundColor: '#1976d2', // Blue circle
      color: '#fff',
      width: 32,
      height: 32,
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      cursor: 'pointer',
      transition: 'transform 0.2s ease-in-out',
      '&:hover': {
        transform: 'scale(1.05)',
      }
    }}
  >
    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>?</Typography>
  </Box>
</Tooltip>

</Box>

  <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 24, justifyContent: 'center', width: '100%' }}>

{/* CONFIGURATION */}
<Box style={{ flex: 1, minWidth: 280 }}>
  <Typography variant="h6" gutterBottom color="primary" align="center">
    Configuration
  </Typography>
  <Box className="option-grid">
    {["page_ranking", "hits"].map((option) => (
      <Box
        key={option}
        className={`option-card ${radioValue === option ? "selected" : ""}`}
        onClick={() => handleRadioChange({ target: { value: option } })}
      >
        {option === "page_ranking" ? "Page Ranking" : "HITS"}
      </Box>
    ))}
  </Box>
</Box>

{/* CLUSTERING */}
<Box style={{ flex: 1, minWidth: 280 }}>
  <Typography variant="h6" gutterBottom color="primary" align="center">
    Clustering
  </Typography>
  <Box className="option-grid">
    {[
      { label: "Flat clustering (KMeans)", value: "flat_clustering" },
      { label: "Agglomerative (Single link)", value: "single_link" },
      { label: "Agglomerative (Complete Link)", value: "complete_link" },
    ].map(({ label, value }) => (
      <Box
        key={value}
        className={`option-card ${radioRestValue === value ? "selected" : ""} ${clusterDisabled ? "disabled" : ""}`}
        onClick={() => {
          if (!clusterDisabled) handleRestRadioChange({ target: { value } });
        }}
      >
        {label}
      </Box>
    ))}
  </Box>
</Box>

{/* QUERY EXPANSION */}
<Box style={{ flex: 1, minWidth: 280, height: 380 }}>
  <Typography variant="h6" gutterBottom color="primary" align="center">
    Query Expansion
  </Typography>
  <Box className="option-grid">
    {[
      { label: "Rocchio algorithm", value: "rocchio_algorithm" },
      { label: "Associative clusters", value: "associative_cluster" },
      { label: "Metric clusters", value: "metric_cluster" },
      { label: "Scalar clusters", value: "scalar_cluster" },
    ].map(({ label, value }) => (
      <Box
        key={value}
        className={`option-card ${radioRestValue === value ? "selected" : ""} ${queryDisabled ? "disabled" : ""}`}
        onClick={() => {
          if (!queryDisabled) handleRestRadioChange({ target: { value } });
        }}
      >
        {label}
      </Box>
    ))}
  </Box>
</Box>

</div>
<ResultsModal
  open={showResult}
  onClose={() => {
    setShowResult(false);
    setQueryExpandValue("");
    setQueryExpand(false);
  }}
  ourData={[...new Map(final_data.map(item => [item.title, item])).values()]}
  googleData={googleResults}
  queryExpanded={queryExpand ? queryExpandValue : ''}
  searchTerm={value}
/>


<Box
  sx={{
    width: '100%',
    marginTop: 4,
    borderRadius: 2,
    padding: 3,
    backgroundColor: '#f0f0f0',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  }}
>

  {/* Configuration */}
  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>Configuration</Typography>
  <Typography variant="body2" sx={{ color: '#555' }}><strong>Page Ranking:</strong> Ranks pages based on keyword relevance and structure.</Typography>
  <Typography variant="body2" sx={{ color: '#555' }}><strong>HITS:</strong> HITS algorithm identifies authoritative and hub pages.</Typography>

  {/* Clustering */}
  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>Clustering</Typography>
  <Typography variant="body2" sx={{ color: '#555' }}><strong>Flat clustering (KMeans):</strong> Groups similar documents into a fixed number of flat clusters.</Typography>
  <Typography variant="body2" sx={{ color: '#555' }}><strong>Agglomerative (Single link):</strong> Clusters are formed by linking the closest pair of documents.</Typography>
  <Typography variant="body2" sx={{ color: '#555' }}><strong>Agglomerative (Complete Link):</strong> Clusters are built by maximizing distance within groups.</Typography>

  {/* Query Expansion */}
  <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold', mt: 2 }}>Query Expansion</Typography>
  <Typography variant="body2" sx={{ color: '#555' }}><strong>Rocchio algorithm:</strong> Enhances queries using vector space feedback from top results.</Typography>
  <Typography variant="body2" sx={{ color: '#555' }}><strong>Associative clusters:</strong> Adds terms related through document associations.</Typography>
  <Typography variant="body2" sx={{ color: '#555' }}><strong>Metric clusters:</strong> Expands query using clustered term distances and metrics.</Typography>
  <Typography variant="body2" sx={{ color: '#555' }}><strong>Scalar clusters:</strong> Uses scalar similarity scores to identify useful expansion terms.</Typography>
</Box>

<footer className="footer">© Musical Bot</footer>

      </header>

    </div>
    
  );
}

export default App;

