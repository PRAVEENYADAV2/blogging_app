"use client";
function formatDate(date) {
  const d = new Date(date);

  const day = d.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  const month = d.toLocaleString("en-US", { month: "short" }); // Feb
  const year = d.getFullYear();
  const time = d.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return `${day}${suffix} ${month} ${year} ${time}`;
}
export default function PostTable({ posts }) {
  async function handleDelete(id) {
    if (!confirm("Delete this post?")) return;
    const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });

    if (res.ok) {
      window.location.reload();
    } else {
      alert("Failed to delete");
    }
  }

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Title</th>
            <th style={thStyle}>Author</th>
            <th style={thStyle}>Created</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {posts.map((p) => (
            <tr key={p._id} style={trStyle}>
              <td style={tdStyle}>
                <a
                  style={{ textDecoration: "none", color: "#444"}}
                  href={`/posts/${p._id}`}
                  target="_blank"
                >
                  <strong>{p.title}</strong>
                </a>
              </td>
              <td style={tdStyle}>{p.author?.username || "Unknown"}</td>
              <td style={tdStyle}>{formatDate(p.createdAt)}</td>
              <td style={tdStyle}>
                <a
                  href={`/admin/edit/${p._id}`}
                  style={{
                    padding: "7px 16px",
                    background: "#000",
                    color: "#fff",
                    textDecoration: "none",
                    borderRadius: "6px",
                  }}
                >
                  Edit
                </a>
                <button style={deleteBtn} onClick={() => handleDelete(p._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const tableStyle = {
  width: "100%",
  minWidth: "600px", // 👈 ensures scroll instead of collapse
  borderCollapse: "collapse",
  fontFamily: "monospace",
};

const thStyle = {
  padding: "10px",
  background: "#eee",
  textAlign: "left",
  whiteSpace: "nowrap",
};

const trStyle = {
  borderBottom: "1px solid #ccc",
};

const tdStyle = {
// fontSize: "15px",
    
  padding: "10px",
  color: "#444",
  whiteSpace: "nowrap", // 👈 prevents text wrapping mess
};

const editBtn = {
  marginRight: "10px",
  cursor: "pointer",
  color: "blue",
  textDecoration: "underline",
};

const deleteBtn = {
  cursor: "pointer",
  border: "none",
  marginLeft: "10px",
  padding: "6px 10px",
  background: "#721121",
  color: "#fff",
  borderRadius: "4px",
};
