import { ApolloProvider, ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Home from './components/Home';
import TODHome from './components/TOD';
import SuperlativeHome from './components/Superlative';
import TodGame from './components/PlayTOD';
import SuperlativeGame from './components/PlaySuperlative';
import Layout from './components/Layout';



const httpLink = createHttpLink({
  uri: 'http://127.0.0.1:8000/graphql/',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/"  element={<Home />} />
            <Route path="/truth-or-dare" element={<TODHome />} />
            <Route path="/superlative" element={<SuperlativeHome />} />
            <Route path='play-tod' element={<TodGame />} />
            <Route path='play-superlative' element={< SuperlativeGame />} />
          </Routes>
          </Layout>
      </Router>
    </ApolloProvider>
  );
};

export default App;
