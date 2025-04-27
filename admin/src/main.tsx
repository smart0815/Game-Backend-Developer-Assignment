import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { 
  Layout, 
  Table, 
  Spin, 
  Alert, 
  Button, 
  Space, 
  Popconfirm, 
  message, 
  Modal,
  Typography
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, WarningOutlined } from '@ant-design/icons';
import { type Game, type GameTableItem } from './types';
import { fetchGames, createGame, updateGame, deleteGame } from './api/gamesApi';
import GameForm from './components/GameForm';

const { Header, Content } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  // State for games data
  const [games, setGames] = useState<GameTableItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for form handling
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [formSubmitting, setFormSubmitting] = useState<boolean>(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [modalTitle, setModalTitle] = useState<string>('Add New Game');

  useEffect(() => {
    loadGames();
  }, []);
  
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
  
  // Handle opening the form modal
  const handleAddGame = () => {
    setEditingGame(null);
    setModalTitle('Add New Game');
    setIsModalVisible(true);
  };
  
  const handleEditGame = (game: Game) => {
    setEditingGame(game);
    setModalTitle(`Edit Game: ${game.name}`);
    setIsModalVisible(true);
  };
  
  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingGame(null);
  };
  
  const handleSubmit = async (values: Omit<Game, 'id'> & { id?: string }) => {
    try {
      setFormSubmitting(true);
      let savedGame: Game;
      
      if (editingGame) {
        // Update existing game
        savedGame = await updateGame(editingGame.id, values);
        message.success(`Game "${savedGame.name}" has been updated`);
      } else {
        // Create new game
        savedGame = await createGame(values);
        message.success(`Game "${savedGame.name}" has been created`);
      }
      
      await loadGames();
      
      setIsModalVisible(false);
      setEditingGame(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'An error occurred';
      message.error(errorMsg);
    } finally {
      setFormSubmitting(false);
    }
  };
  
  const handleDeleteGame = async (id: string) => {
    try {
      setLoading(true);
      await deleteGame(id);
      message.success('Game has been deleted');
      await loadGames();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to delete game';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Table columns with action buttons
  const tableColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Year', dataIndex: 'releaseYear', key: 'releaseYear' },
    { title: 'Publisher', dataIndex: 'publisher', key: 'publisher' },
    { 
      title: 'Type', 
      dataIndex: 'type', 
      key: 'type',
      render: (type: string) => type === 'BaseGame' ? 'Base Game' : 'Expansion'
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Game) => (
        <Space size="middle">
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEditGame(record)}
            size="small"
          />
          <Popconfirm
            title="Delete Game"
            description="Are you sure you want to delete this game?"
            icon={<WarningOutlined style={{ color: 'red' }} />}
            onConfirm={() => handleDeleteGame(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              danger
              icon={<DeleteOutlined />}
              size="small"
            />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        color: 'white', 
        padding: '0 16px'
      }}>
        <Title level={4} style={{ color: 'white', margin: 0 }}>Games Admin</Title>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAddGame}
        >
          Add Game
        </Button>
      </Header>
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
          <Table 
            dataSource={games} 
            columns={tableColumns} 
            pagination={{ pageSize: 10 }}
            rowKey="id"
          />
        )}
        
        <Modal
          title={modalTitle}
          open={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={700}
        >
          <GameForm
            initialValues={editingGame || undefined}
            baseGames={games}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isSubmitting={formSubmitting}
          />
        </Modal>
      </Content>
    </Layout>
  );
};

const root = document.getElementById('root');
if (!root) {
  throw new Error('No root element found to mount the app');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
