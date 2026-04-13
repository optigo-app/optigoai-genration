/**
 * Property 1: Sidebar nav items always have icon and label
 * Validates: Requirements 1.2
 */
import { render, screen, cleanup } from '@testing-library/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import * as fc from 'fast-check';
import Sidebar from '../Sidebar';

const darkTheme = createTheme({ palette: { mode: 'dark' } });

const StubIcon = () => <span data-testid="icon" />;

const navItemArb = fc.array(
  fc.record({
    id: fc.string(),
    label: fc.string({ minLength: 1 }),
    icon: fc.constant(StubIcon),
    isNew: fc.boolean(),
    href: fc.constant('#'),
  }),
  { minLength: 1 }
);

describe(
  'Property 1: sidebar nav items always have icon and label',
  () => {
    afterEach(() => {
      cleanup();
    });

    it(
      'every label appears in the rendered output for arbitrary nav items',
      () => {
        fc.assert(
          fc.property(navItemArb, (navItems) => {
            const { unmount } = render(
              <ThemeProvider theme={darkTheme}>
                <Sidebar navItems={navItems} />
              </ThemeProvider>
            );

            for (const item of navItems) {
              expect(screen.getByText(item.label)).toBeInTheDocument();
            }

            unmount();
          }),
          {
            numRuns: 100,
            verbose: true,
          }
        );
      },
      { tags: ['Feature: ai-creative-platform-ui, Property 1: sidebar nav items always have icon and label'] }
    );
  }
);
