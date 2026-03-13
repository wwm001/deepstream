function Sidebar() {
  return (
    <aside>
      <h2 style={{ marginTop: 0 }}>Navigation</h2>

      <nav>
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            margin: 0,
            display: "grid",
            gap: "12px",
          }}
        >
          <li>ホーム</li>
          <li>ストリーム</li>
          <li>ライブラリ</li>
          <li>設定</li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;