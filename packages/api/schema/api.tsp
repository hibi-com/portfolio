import "@typespec/http";
import "@typespec/openapi3";

// Content
import "./endpoints/posts.tsp";
import "./endpoints/portfolios.tsp";

// CRM
import "./endpoints/customers.tsp";
import "./endpoints/leads.tsp";
import "./endpoints/deals.tsp";
import "./endpoints/pipelines.tsp";

// Communication
import "./endpoints/inquiries.tsp";
import "./endpoints/chats.tsp";
import "./endpoints/emails.tsp";

using TypeSpec.Http;

@service(#{
    title: "Portfolio API",
})
@server("http://localhost:8787")
@server("https://api.example.com")
namespace Api;
