export async function fetchUserHistory(token, mode = null) {
  try {
    const url = mode
      ? `http://localhost:8000/api/v1/user/history?mode=${mode}`
      : 'http://localhost:8000/api/v1/user/history';
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) return [];
    const json = await response.json();
    return json.data || [];
  } catch (e) {
    console.error("Error fetching history:", e);
    return [];
  }
}

export async function fetchUserAnalytics(token, mode = null) {
  try {
    const url = mode
      ? `http://localhost:8000/api/v1/user/analytics?mode=${mode}`
      : 'http://localhost:8000/api/v1/user/analytics';
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!response.ok) return null;
    const json = await response.json();
    return json.data || null;
  } catch (e) {
    console.error("Error fetching analytics:", e);
    return null;
  }
}

export async function deleteUserScan(docId, token) {
  try {
    const response = await fetch(`http://localhost:8000/api/v1/user/history/${docId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.ok;
  } catch (e) {
    console.error("Error deleting scan:", e);
    return false;
  }
}
