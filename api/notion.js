export default async function handler(req, res) {
  try {
    if (req.method !== "GET") {
      return res.status(405).json({
        error: "Method not allowed"
      });
    }

    const token = process.env.NOTION_TOKEN;

    const transactionsDataSourceId =
      process.env.NOTION_TRANSACTIONS_DATA_SOURCE_ID;

    const typesDataSourceId =
      process.env.NOTION_TRANSACTION_TYPES_DATA_SOURCE_ID;

    if (
      !token ||
      !transactionsDataSourceId ||
      !typesDataSourceId
    ) {
      return res.status(500).json({
        error: "Missing Notion environment variables"
      });
    }

    // --------------------------------
    // 1. GET TRANSACTIONS
    // --------------------------------

    const transactionsResponse = await fetch(
      `https://api.notion.com/v1/data_sources/${transactionsDataSourceId}/query`,
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

    const transactionsData =
      await transactionsResponse.json();

    if (!transactionsResponse.ok) {
      return res.status(transactionsResponse.status).json({
        error:
          transactionsData.message ||
          "Transactions API error",
        details: transactionsData
      });
    }

    // --------------------------------
    // 2. GET TRANSACTION TYPES
    // --------------------------------

    const typesResponse = await fetch(
      `https://api.notion.com/v1/data_sources/${typesDataSourceId}/query`,
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

    const typesData = await typesResponse.json();

    if (!typesResponse.ok) {
      return res.status(typesResponse.status).json({
        error:
          typesData.message ||
          "Transaction Types API error",
        details: typesData
      });
    }

    // --------------------------------
    // 3. CREATE TYPE ID → NAME MAP
    // --------------------------------

    const typeMap = {};

    (typesData.results || []).forEach((typePage) => {
      const properties =
        typePage.properties || {};

      let name = null;

      // Try Title
      for (const key of Object.keys(properties)) {
        const property = properties[key];

        if (
          property.type === "title" &&
          property.title?.length
        ) {
          name = property.title
            .map((item) => item.plain_text)
            .join("");

          break;
        }
      }

      if (name) {
        typeMap[typePage.id] = name;
      }
    });

    // --------------------------------
    // 4. ADD RESOLVED TYPE TO EACH
    // TRANSACTION
    // --------------------------------

    const transactions =
      (transactionsData.results || []).map(
        (transaction) => {

          const properties =
            transaction.properties || {};

          const direction =
            properties["Direction"]?.formula?.string ||
            null;

          const amount =
            properties["Amount"]?.number ??
            null;

          const date =
            properties["Date"]?.date?.start ??
            null;

          const typeRelation =
            properties["Type"]?.relation || [];

          const typeIds =
            typeRelation.map(
              (item) => item.id
            );

          const typeNames =
            typeIds
              .map((id) => typeMap[id])
              .filter(Boolean);

          return {
            ...transaction,

            kpi: {
              direction,
              amount,
              date,

              typeIds,
              typeNames
            }
          };
        }
      );

    return res.status(200).json({
      ...transactionsData,
      results: transactions
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: "Server error",
      message: error.message
    });
  }
}
