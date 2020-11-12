{
  "id": "@acme/app-ip_address",
  "type": "Application",
  "title": "ip-address",
  "displayName": "IP Address",
  "export": "IpAddress",
  "summary": "The IP Address application performs operations on IP addresses.",
  "src": "main.js",
  "encrypted": false,
  "roles": [
    "admin",
    "engineering",
    "support",
    "apiread",
    "apiwrite"
  ],
  "methods": [
    {
      "name": "getFirstIpAddress",
      "display_name": "Get First IP Address",
      "deprecated": false,
      "summary": "Get Subnet's First IP Address",
      "description": "Calculates and returns the first host IP address from a CIDR subnet.",
      "input": [
        {
          "name": "cidrStr",
          "description": "The IPv4 subnet expressed in CIDR format.",
          "type": "string",
          "info": "Request subnet from IPAM.",
          "required": true,
          "schema": {
            "title": "cidrStr",
            "$ref": "ipAddresses#/definitions/ipv4CIDR"
          }
        }
      ],
      "output": {
        "name": "firstIpAddress",
        "description": "An object containing both an IPv4 address and its mapped ipv6 address.",
        "type": "object",
        "schema": {
          "title": "firstIpAddress",
          "$ref": "ipAddresses#/definitions/hostIpv4AndIpv6Address"
        }
      },
      "route": {
        "path": "/firstIpAddress/:cidrStr",
        "verb": "GET"
      },
      "roles": [
        "admin",
        "engineering",
        "support",
        "apiread"
      ],
      "task": true
    }
  ],
  "views": []
}