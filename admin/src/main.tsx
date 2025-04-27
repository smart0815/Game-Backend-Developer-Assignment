import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Layout, Table, Spin, Alert } from 'antd';
import { type Game, type GameTableItem } from './types';
import { fetchGames } from './api/gamesApi';

const root = document.getElementById('root');
if (!root) {
  throw new Error('No root element found to mount the app');
}

const { Header, Content } = Layout;

const App: React.FC = () => {
  const [games, setGames] = useState<GameTableItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch games from the API when the component mounts
    const loadGames = async () => {
      try {
        setLoading(true);
        const gamesData = await fetchGames();
        const gamesWithKeys: GameTableItem[] = gamesData.map((game) => ({
          ...game,
          key: game.id
        }));
        setGames(gamesWithKeys);
        setError(null);
      } catch (err) {
        console.error('Failed to load games:', err);
        setError('Failed to load games. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadGames();
  }, []);

  const tableColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Year', dataIndex: 'releaseYear', key: 'releaseYear' },
    { title: 'Publisher', dataIndex: 'publisher', key: 'publisher' },
  ];

  return (
    <Layout>
      <Header style={{ color: 'white', fontSize: '20px' }}>Admin</Header>
      <Content style={{ padding: '20px' }}>
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: '20px' }}
          />
        )}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <Spin size="large" tip="Loading games..." />
          </div>
        ) : (
          <Table dataSource={games} columns={tableColumns} />
        )}
      </Content>
    </Layout>
  );
};

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
