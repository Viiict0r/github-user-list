import React, {useState, useEffect} from 'react';

import {Keyboard, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import Icon from 'react-native-vector-icons/MaterialIcons';
import {
  Container,
  Form,
  Input,
  SubmitButton,
  List,
  User,
  Avatar,
  Name,
  Bio,
  ProfileButton,
  ProfileButtonText,
} from './styles';

import api from '../../services/api';

export default function Main() {
  const [users, setUsers] = useState('');
  const [newUser, setNewUser] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    const stUsers = await AsyncStorage.getItem('users');

    if (stUsers) {
      setUsers(JSON.parse(stUsers));
    }
  }, []);

  async function handleAddUser() {
    setLoading(true);

    const response = await api.get(`/users/${newUser}`);

    const data = {
      name: response.data.name,
      login: response.data.login,
      bio: response.data.bio,
      avatar: response.data.avatar_url,
    };

    setUsers([...users, data]);

    console.tron.log(users);
    await AsyncStorage.setItem('users', JSON.stringify(users));

    setNewUser('');
    setLoading(false);

    Keyboard.dismiss();
  }

  return (
    <Container>
      <Form>
        <Input
          autoCorrect={false}
          autoCapitalize="none"
          placeholder="Adicionar usuário"
          value={newUser}
          onChangeText={text => setNewUser(text)}
          returnKeyType="send"
          onSubmitEditing={handleAddUser}
        />
        <SubmitButton loading={loading} onPress={handleAddUser}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Icon name="add" size={20} color="#fff" />
          )}
        </SubmitButton>
      </Form>

      <List
        data={users}
        keyExtractor={user => user.login}
        renderItem={({item}) => (
          <User>
            <Avatar source={{uri: item.avatar}} />
            <Name>{item.name}</Name>
            <Bio>{item.bio}</Bio>

            <ProfileButton onPress={() => {}}>
              <ProfileButtonText>Ver perfil</ProfileButtonText>
            </ProfileButton>
          </User>
        )}
      />
    </Container>
  );
}

Main.navigationOptions = {
  title: 'Página inicial',
};
