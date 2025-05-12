import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import SharedLayout from '@/components/layout/SharedLayout';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';

// Define the translation interface
interface Translation {
  key: string;
  en: string;
  sl: string;
}

// Define the type for pages with custom layouts
interface PageWithLayout {
  getLayout?: (page: React.ReactNode) => React.ReactNode;
}

const TranslationsEditor: React.FC & PageWithLayout = () => {
  const { language } = useLanguage();
  const { isAuthenticated, isLoading: authLoading, loginWithRedirect, logout, getAccessTokenSilently } = useAuth();
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ en: string; sl: string }>({ en: '', sl: '' });
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [addDialogOpen, setAddDialogOpen] = useState<boolean>(false);
  const [newTranslation, setNewTranslation] = useState<Translation>({ key: '', en: '', sl: '' });
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Fetch translations
  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchTranslations = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching translations...');
        
        // Try to fetch from the Netlify function first
        try {
          // Get the access token
          const token = await getAccessTokenSilently();
          
          // Use the Netlify serverless function to fetch translations
          const response = await fetch('/.netlify/functions/translations', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('Successfully fetched translations from Netlify function');
            
            // Convert the data to an array of Translation objects
            const translationsArray = Object.entries(data).map(([key, value]: [string, any]) => ({
              key,
              en: value.en || '',
              sl: value.sl || ''
            }));
            
            setTranslations(translationsArray);
            setLoading(false);
            return;
          } else {
            console.warn(`Netlify function returned status: ${response.status}`);
          }
        } catch (netlifyError) {
          console.warn('Error fetching from Netlify function:', netlifyError);
        }
        
        // Fallback: Try to fetch directly from the JSON file
        try {
          console.log('Trying direct access to translations.json...');
          const token = await getAccessTokenSilently();
          
          const directResponse = await fetch('/netlify/functions/translations/translations.json', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            }
          });
          
          if (directResponse.ok) {
            const data = await directResponse.json();
            console.log('Successfully fetched translations from direct JSON file');
            
            // Convert the data to an array of Translation objects
            const translationsArray = Object.entries(data).map(([key, value]: [string, any]) => ({
              key,
              en: value.en || '',
              sl: value.sl || ''
            }));
            
            setTranslations(translationsArray);
            setLoading(false);
            return;
          } else {
            console.warn(`Direct JSON access returned status: ${directResponse.status}`);
            throw new Error(`Failed to fetch translations: ${directResponse.status}`);
          }
        } catch (directError) {
          console.error('Error with direct JSON access:', directError);
          throw directError;
        }
      } catch (error) {
        console.error('Error fetching translations:', error);
        setError('Failed to load translations');
        setLoading(false);
      }
    };
    
    fetchTranslations();
  }, [isAuthenticated, getAccessTokenSilently]);

  // Save edited translation
  const handleSave = async () => {
    if (!editingKey) return;

    try {
      // Find the translation being edited
      const translationIndex = translations.findIndex(t => t.key === editingKey);
      if (translationIndex === -1) return;

      // Create updated translations array
      const updatedTranslations = [...translations];
      updatedTranslations[translationIndex] = {
        ...updatedTranslations[translationIndex],
        en: editValues.en,
        sl: editValues.sl
      };

      // Get the access token
      const token = await getAccessTokenSilently();
      
      // Save to the API
      const response = await fetch('/.netlify/functions/translations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          key: editingKey,
          translations: {
            en: editValues.en,
            sl: editValues.sl
          }
        })
      });

      if (response.ok) {
        // Update local state
        setTranslations(updatedTranslations);
        setEditingKey(null);
        setMessage({ type: 'success', text: 'Translation updated successfully!' });
        
        // Clear message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update translation');
      }
    } catch (error) {
      console.error('Error saving translation:', error);
      setMessage({ type: 'error', text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}` });
      
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    }
  };

  // Handle login with GitHub OAuth or database connection
  const handleLogin = () => {
    loginWithRedirect({
      // Allow Auth0 to show all available login options
      // This will include GitHub if configured in Auth0 dashboard
    });
  };

  // Handle logout
  const handleLogout = () => {
    logout();
  };

  // Start editing a translation
  const handleEdit = (translation: Translation) => {
    setEditingKey(translation.key);
    setEditValues({ en: translation.en, sl: translation.sl });
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingKey(null);
    setEditValues({ en: '', sl: '' });
  };

  // Handle input change for editing
  const handleEditChange = (field: 'en' | 'sl', value: string) => {
    setEditValues(prev => ({ ...prev, [field]: value }));
  };

  // Handle input change for new translation
  const handleNewTranslationChange = (field: 'key' | 'en' | 'sl', value: string) => {
    setNewTranslation(prev => ({ ...prev, [field]: value }));
  };

  // Add new translation
  const handleAddTranslation = async () => {
    // Validate new translation
    if (!newTranslation.key || !newTranslation.en) {
      setMessage({ type: 'error', text: 'Key and English translation are required' });
      return;
    }

    // Check if key already exists
    if (translations.some(t => t.key === newTranslation.key)) {
      setMessage({ type: 'error', text: 'Translation key already exists' });
      return;
    }

    // Add new translation to the list
    setTranslations(prev => [...prev, newTranslation]);
    
    // Get the access token
    const token = await getAccessTokenSilently();
    
    // Save to the API
    const response = await fetch('/.netlify/functions/translations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        key: newTranslation.key,
        translations: {
          en: newTranslation.en,
          sl: newTranslation.sl
        }
      })
    });

    if (response.ok) {
      setMessage({ type: 'success', text: 'Translation added successfully!' });
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add translation');
    }
    
    // Clear the form and close the dialog
    setNewTranslation({ key: '', en: '', sl: '' });
    setAddDialogOpen(false);
  };

  // Filter translations based on search term
  const filteredTranslations = translations.filter(translation => 
    translation.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
    translation.en.toLowerCase().includes(searchTerm.toLowerCase()) ||
    translation.sl.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Translations Editor
          </Typography>
          <Typography variant="body1" paragraph>
            You need to be authenticated to access this page.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<LoginIcon />}
            onClick={handleLogin}
            sx={{ mt: 2 }}
          >
            Log In with Auth0
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Translations Editor
        </Typography>
        
        <Button
          variant="outlined"
          color="secondary"
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
        >
          Logout
        </Button>
      </Box>
      
      {message && (
        <Alert 
          severity={message.type} 
          sx={{ mb: 3 }}
          onClose={() => setMessage(null)}
        >
          {message.text}
        </Alert>
      )}
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search translations"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          
          <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={() => setAddDialogOpen(true)}
            >
              Add Translation
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Key</TableCell>
                <TableCell>English</TableCell>
                <TableCell>Slovenian</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTranslations.map((translation) => (
                <TableRow key={translation.key}>
                  <TableCell component="th" scope="row">
                    {translation.key}
                  </TableCell>
                  
                  <TableCell>
                    {editingKey === translation.key ? (
                      <TextField
                        fullWidth
                        value={editValues.en}
                        onChange={(e) => handleEditChange('en', e.target.value)}
                        size="small"
                      />
                    ) : (
                      translation.en
                    )}
                  </TableCell>
                  
                  <TableCell>
                    {editingKey === translation.key ? (
                      <TextField
                        fullWidth
                        value={editValues.sl}
                        onChange={(e) => handleEditChange('sl', e.target.value)}
                        size="small"
                      />
                    ) : (
                      translation.sl
                    )}
                  </TableCell>
                  
                  <TableCell align="right">
                    {editingKey === translation.key ? (
                      <>
                        <IconButton color="primary" onClick={handleSave}>
                          <SaveIcon />
                        </IconButton>
                        <IconButton color="secondary" onClick={handleCancel}>
                          <CancelIcon />
                        </IconButton>
                      </>
                    ) : (
                      <IconButton color="primary" onClick={() => handleEdit(translation)}>
                        <EditIcon />
                      </IconButton>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      
      {/* Add Translation Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)}>
        <DialogTitle>Add New Translation</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="key"
            label="Translation Key"
            fullWidth
            variant="outlined"
            value={newTranslation.key}
            onChange={(e) => handleNewTranslationChange('key', e.target.value)}
            helperText="e.g., 'Navbar.about' or 'HomePage.welcome'"
          />
          <TextField
            margin="dense"
            id="en"
            label="English Translation"
            fullWidth
            variant="outlined"
            value={newTranslation.en}
            onChange={(e) => handleNewTranslationChange('en', e.target.value)}
          />
          <TextField
            margin="dense"
            id="sl"
            label="Slovenian Translation"
            fullWidth
            variant="outlined"
            value={newTranslation.sl}
            onChange={(e) => handleNewTranslationChange('sl', e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleAddTranslation} variant="contained" color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

// Define a custom layout for this page
TranslationsEditor.getLayout = (page: React.ReactNode) => {
  return <SharedLayout>{page}</SharedLayout>;
};

export default TranslationsEditor;
