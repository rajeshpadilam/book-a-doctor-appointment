export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <span>© {new Date().getFullYear()} DocBook — demo MERN project.</span>
        <span className="tag">MongoDB · Express · React · Node</span>
      </div>
    </footer>
  );
}
