import { render, screen } from '@testing-library/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Sidebar from '../Sidebar';
import { NAV_ITEMS } from '../../data/navItems';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

function renderSidebar() {
  return render(
    <ThemeProvider theme={darkTheme}>
      <Sidebar />
    </ThemeProvider>
  );
}

describe('Sidebar', () => {
  it('renders all nav item labels from NAV_ITEMS', () => {
    renderSidebar();
    for (const item of NAV_ITEMS) {
      expect(screen.getByText(item.label)).toBeInTheDocument();
    }
  });

  it('renders a NEW chip for the Blueprints nav item', () => {
    renderSidebar();
    expect(screen.getByText('NEW')).toBeInTheDocument();
    // Confirm it is only shown for Blueprints (the only isNew item)
    const blueprintsItem = NAV_ITEMS.find((i) => i.id === 'blueprints');
    expect(blueprintsItem.isNew).toBe(true);
  });

  it('renders the Upgrade button', () => {
    renderSidebar();
    expect(screen.getByRole('button', { name: /upgrade/i })).toBeInTheDocument();
  });
});
