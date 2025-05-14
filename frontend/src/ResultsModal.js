import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { Dialog, Box, Button, Typography, Tabs, Tab, Card, CardContent } from '@mui/material';

const ResultsModal = ({ open, onClose, ourData, googleData, queryExpanded, searchTerm }) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (_, newIndex) => {
    setTabIndex(newIndex);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        style: {
          backgroundColor: '#f9f9f9',
          width: '80%',
          height: '80%',
          margin: 'auto',
          borderRadius: 12,
          padding: '24px',
        }
      }}
    >
      {/* Close Icon */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button onClick={onClose} sx={{ minWidth: 'auto' }}>
          <CloseIcon />
        </Button>
      </Box>

      {/* Title */}
      <Typography variant="h5" align="center" sx={{ color: '#222', mb: 1 }}>
        Search Results Comparison
      </Typography>

      {/* Expanded Query */}
      {queryExpanded && (
        <Typography variant="subtitle2" align="center" sx={{ color: '#555', mb: 2 }}>
          <strong>Expanded Query:</strong> {queryExpanded}
        </Typography>
      )}

      {/* Tabs */}
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        centered
        textColor="primary"
        indicatorColor="primary"
        sx={{ marginBottom: 2 }}
      >
        <Tab label="Our Results" />
        <Tab label="Google Results" />
        <Tab label="Bing Results" />
      </Tabs>

      {/* Tab Content */}
      <Box sx={{ overflowY: 'auto', height: '100%' }}>
        {tabIndex === 0 && (
          <Box>
            {ourData.map(doc => (
              <Card key={doc.id} sx={{ mt: 2, backgroundColor: '#fff' }}>
                <CardContent>
                  <Typography variant="h6" component="a" href={doc.url} target="_blank" rel="noopener noreferrer" sx={{ color: '#0d47a1', textDecoration: 'none' }}>
                    {doc.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#444' }}>
                    {doc.meta_info.split(' ').slice(0, 20).join(' ')}...
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

        {tabIndex === 1 && (
          <Box>
            {googleData.length > 0 ? (
              googleData.map((item, index) => (
                <Card key={index} sx={{ mt: 2, backgroundColor: '#fff' }}>
                  <CardContent>
                    <Typography variant="h6" component="a" href={item.link} target="_blank" rel="noopener noreferrer" sx={{ color: '#0d47a1', textDecoration: 'none' }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#444' }}>{item.snippet}</Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Typography variant="body2" sx={{ mt: 2, color: '#888' }}>
                No results from Google.
              </Typography>
            )}
          </Box>
        )}

        {tabIndex === 2 && (
          <Box>
            <iframe
              src={`https://www.bing.com/search?q=${encodeURIComponent(searchTerm)}`}
              style={{ width: '100%', height: '60vh', border: '1px solid #ccc', marginTop: 16 }}
              title="Bing Results"
            />
          </Box>
        )}
      </Box>

      {/* Bottom Close Button */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button variant="contained" onClick={onClose}>Close</Button>
      </Box>
    </Dialog>
  );
};

export default ResultsModal;
