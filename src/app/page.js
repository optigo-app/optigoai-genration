import Box from '@mui/material/Box';
import Sidebar from '@/components/Sidebar';
import HeroSection from '@/components/HeroSection';
import FeaturedBlueprints from '@/components/FeaturedBlueprints';
import CommunityCreations from '@/components/CommunityCreations';

export default function Home() {
  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh', p: '12px', gap: '12px' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flex: 1, ml: '80px',
          minHeight: 'calc(100vh - 24px)',
          bgcolor: 'background.paper',
          borderRadius: '16px',
          border: '1px solid', borderColor: 'divider',
          boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <HeroSection />
        <FeaturedBlueprints />
        <CommunityCreations />
      </Box>
    </Box>
  );
}
