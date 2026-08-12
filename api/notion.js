export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({
        error: "Method not allowed"
      });
    }

    const token = process.env.NOTION_TOKEN;
    const dataSourceId =
      process.env.NOTION_TRANSACTIONS_DATA_SOURCE_ID;

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

    const transactions = (data.results || []).map((transaction) => {
      const properties = transaction.properties || {};

      // Direction
      const direction =
        properties["Direction"]?.formula?.string || null;

      // Type relation
      const typeRelation =
        properties["Type"]?.relation || [];

      // From Account relation
      const fromAccount =
        properties["From Acc"]?.relation || [];

      // To Account relation
      const toAccount =
        properties["To Acc"]?.relation || [];

      return {
        ...transaction,

        kpi: {
          direction,
          typeIds: typeRelation.map((item) => item.id),
          fromAccountIds: fromAccount.map((item) => item.id),
          toAccountIds: toAccount.map((item) => item.id)
        }
      };
    });

    return res.status(200).json({
      ...data,
      results: transactions
    });

  } catch (error) {
    return res.status(500).json({
      error: "Server error",
      message: error.message
    });
  }
}
