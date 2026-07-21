const Loader = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center" style={{ minHeight:'60vh', gap:20 }}>
    <div style={{ position:'relative', width:60, height:60 }}>
      <div style={{ position:'absolute', inset:0, borderRadius:'50%', border:'3px solid rgba(108,99,255,0.15)', borderTopColor:'#6c63ff', animation:'spin 1s linear infinite' }} />
      <div style={{ position:'absolute', inset:8, borderRadius:'50%', border:'2px solid rgba(255,101,132,0.12)', borderTopColor:'#ff6584', animation:'spin 0.7s linear infinite reverse' }} />
      <div style={{ position:'absolute', inset:18, borderRadius:'50%', background:'linear-gradient(135deg,#6c63ff,#ff6584)', animation:'pulse 1.5s ease-in-out infinite' }} />
    </div>
    <p style={{ color:'#6b7280', fontSize:14, letterSpacing:'0.06em', fontWeight:500 }}>{text}</p>
    <style>{`@keyframes spin{to{transform:rotate(360deg)}} @keyframes pulse{0%,100%{opacity:0.5;transform:scale(0.85)}50%{opacity:1;transform:scale(1.1)}}`}</style>
  </div>
);

export default Loader;