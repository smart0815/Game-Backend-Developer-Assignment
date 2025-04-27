import React, { useState, useEffect } from 'react';
import { Form, Input, Button, InputNumber, Select, Switch, Row, Col, Card } from 'antd';
import { type Game, type BaseGame, type Expansion, GameType } from '../types';

const { Option } = Select;

interface GameFormProps {
  initialValues?: Game;
  baseGames?: Game[];
  onSubmit: (values: Omit<Game, 'id'> & { id?: string }) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}

const GameForm: React.FC<GameFormProps> = ({ 
  initialValues, 
  baseGames = [], 
  onSubmit, 
  onCancel,
  isSubmitting 
}) => {
  const [form] = Form.useForm();
  const [gameType, setGameType] = useState<GameType>(
    initialValues?.type || GameType.BaseGame
  );

  // Update form when initialValues change
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
      setGameType(initialValues.type);
    }
  }, [initialValues, form]);

  const handleTypeChange = (value: GameType) => {
    setGameType(value);
    
    // Reset fields that are specific to the other type
    if (value === GameType.BaseGame) {
      form.setFieldsValue({ 
        baseGame: undefined, 
        standalone: undefined 
      });
    } else {
      form.setFieldsValue({ 
        expansions: undefined 
      });
    }
  };

  const handleFinish = (values: any) => {
    const gameData = { ...values };
    
    // Add the id if editing
    if (initialValues?.id) {
      gameData.id = initialValues.id;
    }
    
    onSubmit(gameData);
  };

  return (
    <Card title={initialValues ? 'Edit Game' : 'Add New Game'}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={initialValues || { 
          type: GameType.BaseGame,
          players: { min: 2, max: 4 }
        }}
      >
        {initialValues?.id && (
          <Form.Item label="ID" name="id">
            <Input disabled />
          </Form.Item>
        )}

        <Form.Item 
          label="Name" 
          name="name" 
          rules={[{ required: true, message: 'Please enter the game name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Release Year" name="releaseYear">
          <InputNumber min={1900} max={new Date().getFullYear()} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label="Publisher" name="publisher">
          <Input />
        </Form.Item>

        <Form.Item label="Game Type" name="type" rules={[{ required: true }]}>
          <Select onChange={handleTypeChange}>
            <Option value={GameType.BaseGame}>Base Game</Option>
            <Option value={GameType.Expansion}>Expansion</Option>
          </Select>
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item 
              label="Min Players" 
              name={['players', 'min']}
              rules={[{ required: true, message: 'Required' }]}
            >
              <InputNumber min={1} max={20} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item 
              label="Max Players" 
              name={['players', 'max']}
              rules={[{ required: true, message: 'Required' }]}
            >
              <InputNumber min={1} max={20} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>

        {gameType === GameType.BaseGame && (
          <Form.Item label="Expansions" name="expansions">
            <Select mode="multiple" placeholder="Select expansions">
              {baseGames
                .filter(game => game.type === GameType.Expansion)
                .map(game => (
                  <Option key={game.id} value={game.id}>{game.name}</Option>
                ))
              }
            </Select>
          </Form.Item>
        )}

        {gameType === GameType.Expansion && (
          <>
            <Form.Item 
              label="Base Game" 
              name="baseGame"
              rules={[{ required: true, message: 'Please select the base game' }]}
            >
              <Select placeholder="Select base game">
                {baseGames
                  .filter(game => game.type === GameType.BaseGame)
                  .map(game => (
                    <Option key={game.id} value={game.id}>{game.name}</Option>
                  ))
                }
              </Select>
            </Form.Item>

            <Form.Item 
              label="Standalone" 
              name="standalone"
              valuePropName="checked"
              rules={[{ required: true, message: 'Required' }]}
            >
              <Switch />
            </Form.Item>
          </>
        )}

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={isSubmitting} style={{ marginRight: 8 }}>
            {initialValues ? 'Update' : 'Create'}
          </Button>
          <Button onClick={onCancel}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default GameForm; 