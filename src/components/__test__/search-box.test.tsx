
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import axios from 'axios';
import SearchBox from '../SearchBox';

// Define Product interface
interface Product {
  id: number;
  name: string;
  description: string;
}

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Create a query client for testing
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0, 
      },
    },
  });

const renderWithClient = (component: React.ReactElement) => {
  const queryClient = createTestQueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

// Mock product data
const mockProducts: Product[] = [
  { id: 1, name: 'Product 1', description: 'Description 1' },
  { id: 2, name: 'Product 2', description: 'Description 2' },
];

describe('SearchBox Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input and button', () => {
    renderWithClient(<SearchBox />);
    
    expect(screen.getByPlaceholderText('Search for products...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('updates input value when typing', async () => {
    renderWithClient(<SearchBox />);
    const input = screen.getByPlaceholderText('Search for products...');
    
    await userEvent.type(input, 'test');
    expect(input).toHaveValue('test');
  });

  it('shows loading state when searching', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockProducts });
    renderWithClient(<SearchBox />);
    
    const input = screen.getByPlaceholderText('Search for products...');
    await userEvent.type(input, 'test');

    await waitFor(() => {
      expect(screen.getAllByRole('status')).toHaveLength(3); 
    }, { timeout: 500 });
  });

  it('displays products when search returns results', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockProducts });
    renderWithClient(<SearchBox />);
    
    const input = screen.getByPlaceholderText('Search for products...');
    await userEvent.type(input, 'testing');

    await waitFor(() => {
      expect(screen.getByText('Product 1')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
      expect(screen.getByText('Product 2')).toBeInTheDocument();
      expect(screen.getByText('Description 2')).toBeInTheDocument();
    }, { timeout: 500 });
  });

  it('shows no results message when search returns empty', async () => {
    mockedAxios.get.mockResolvedValue({ data: [] });
    renderWithClient(<SearchBox />);
    
    const input = screen.getByPlaceholderText('Search for products...');
    await userEvent.type(input, 'test');

    await waitFor(() => {
      expect(screen.getByText('No products found.')).toBeInTheDocument();
    }, { timeout: 500 });
  });

  it('does not fetch when query length is less than 3', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockProducts });
    renderWithClient(<SearchBox />);
    
    const input = screen.getByPlaceholderText('Search for products...');
    await userEvent.type(input, 'te');

    await waitFor(() => {
      expect(mockedAxios.get).not.toHaveBeenCalled();
    }, { timeout: 500 });
  });

  it('handles API error gracefully', async () => {
    mockedAxios.get.mockRejectedValue(new Error('API Error'));
    renderWithClient(<SearchBox />);
    
    const input = screen.getByPlaceholderText('Search for products...');
    await userEvent.type(input, 'test');

    await waitFor(() => {
      expect(screen.queryByText('Product 1')).not.toBeInTheDocument();
    }, { timeout: 500 });
  });

  it('debounces search input', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockProducts });
    renderWithClient(<SearchBox />);
    
    const input = screen.getByPlaceholderText('Search for products...');
    await userEvent.type(input, 't');
    await userEvent.type(input, 'e');
    await userEvent.type(input, 's');
    await userEvent.type(input, 't');

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledTimes(1);
      expect(mockedAxios.get).toHaveBeenCalledWith('/api/search?query=test');
    }, { timeout: 500 });
  });
});