export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const token = process.env.NOTION_TOKEN;
    const dataSourceId = process.env.NOTION_TRANSACTIONS_DATA_SOURCE_ID;

    if (!token || !dataSourceId) {
      return res.status(500).json({
        error: "Missing Notion environment variables"
      });
    }

    const response = await fetch(
      `https://api.notion.com/v1/data_sources/${dataSourceId}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Notion-Version": "2026-03-11",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          page_size: 100
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.message || "Notion API error",
        details: data
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Server error",
      message: error.message
    });
  }
}
