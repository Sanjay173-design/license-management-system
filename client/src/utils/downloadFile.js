export async function downloadFile(url, filename) {
  try {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const blob = await res.blob();
    const link = document.createElement("a");

    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    link.remove();
  } catch (err) {
    alert("Download failed");
  }
}
