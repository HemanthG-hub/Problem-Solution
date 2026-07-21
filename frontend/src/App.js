import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import ProblemDetail from './pages/ProblemDetail';
import SubmitSolution from './pages/SubmitSolution';
import MySubmissions from './pages/MySubmissions';
import PostProblem from './pages/PostProblem';
import ReviewSubmissions from './pages/ReviewSubmissions';
import Profile from './pages/Profile';

function App() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Navbar />
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Dashboard />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/problem/:id" element={<ProblemDetail />} />
          <Route path="/submit/:problemId" element={<SubmitSolution />} />
          <Route path="/my-submissions" element={<MySubmissions />} />
          <Route path="/post-problem" element={<PostProblem />} />
          <Route path="/review/:problemId" element={<ReviewSubmissions />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;