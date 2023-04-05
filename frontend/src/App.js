import {useState, useEffect} from 'react';
import { getArtists, updateArtist, updateArtistRate, createArtists, deleteArtists } from './api';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

function App() {
  const [artists, setArtists] = useState([]);
  const [newArtist, setNewArtist] = useState({ artist: '', rate: undefined, streams: undefined });
  const [newRate, setNewRate] = useState({  artist: '', rate: undefined});

  useEffect(() => {
    getArtists()
      .then(data => {
        setArtists(data);
      })
  }, [])

  function handleCompleteToggle(event, artist) {
    updateArtist(artist._id, {
      ...artist,
      payout_complete: event.target.checked,
    })
    window.location.reload(false); //reload page automatically to see changes
  }
  
  function handleNewArtistChange(event) {
    setNewArtist({ ...newArtist, [event.target.name]: event.target.value });
    event.preventDefault();
  }

  function handleNewArtist(event) {
    createArtists(newArtist);
    window.location.reload(false);
  }

  function handleDeleteArtist(event, id) {
    deleteArtists(id);
    window.location.reload(false);
  }

  function handleUpdateArtistChange(event) {
    setNewRate({ ...newRate, [event.target.name]: event.target.value });
    event.preventDefault();
  }

  function handleUpdateArtist(event) {
    updateArtistRate(newRate.artist, {rate: newRate.rate})
    window.location.reload(false);
  }

  return (
    <div>
    <h1>Streaming Royalties Table</h1>
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="center">Streams</TableCell>
            <TableCell align="center">Rates</TableCell>
            <TableCell align="center">Complete</TableCell>
            <TableCell align="center">Average Payout/Month</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {artists.sort((a,b) => b.payout_amount - a.payout_amount).map((artist) => (
            <TableRow
              key={artist._id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {artist.artist}
              </TableCell>
              <TableCell align="center">{artist.streams.toLocaleString()}</TableCell>
              <TableCell align="center">${artist.rate}</TableCell>
              <TableCell align="center"><input
                type="checkbox"
                checked={artist.payout_complete}
                onChange={event => handleCompleteToggle(event, artist)}
              /></TableCell>
              <TableCell align="center">${(
                (artist.streams * artist.rate) /
                (new Date().getFullYear() * 12 - 2006 * 12)
              ).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2 })}</TableCell>
              <TableCell align="center" onClick={event => handleDeleteArtist(event, artist._id)}><button>Delete</button></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
    <h2>Create Artist</h2>
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField id="outlined-basic" label="Artist Name" variant="filled" name="artist" value={newArtist.artist} onChange={handleNewArtistChange}/>
      <TextField id="filled-basic" label="Rate" variant="filled" name="rate" value={newArtist.rate} onChange={handleNewArtistChange}/>
      <TextField id="standard-basic" label="Streams" variant="filled" name="streams" value={newArtist.streams} onChange={handleNewArtistChange}/>
    </Box>
    <Stack spacing={2} direction="row">
      <Button variant="contained" onClick={handleNewArtist}>Submit</Button>
    </Stack>
    <h2>Update Artist</h2>
    <Box
      component="form"
      sx={{
        '& > :not(style)': { m: 1, width: '25ch' },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField id="outlined-basic" label="Artist Name" variant="filled" name="artist" value={newRate.artist} onChange={handleUpdateArtistChange}/>
      <TextField id="filled-basic" label="Rate" variant="filled" name="rate" value={newRate.rate} onChange={handleUpdateArtistChange}/>
    </Box>
    <Stack spacing={2} direction="row">
      <Button variant="contained" onClick={handleUpdateArtist}>Submit</Button>
    </Stack>
    </div>
  );
}

export default App;
