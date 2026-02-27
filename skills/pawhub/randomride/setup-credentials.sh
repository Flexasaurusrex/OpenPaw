#!/bin/bash
# Setup Uber credentials on Render
# Run this via Render shell or add to startup script

mkdir -p /opt/render/.openpaw/secrets
chmod 700 /opt/render/.openpaw/secrets

cat > /opt/render/.openpaw/secrets/.uber_credentials.json << 'EOF'
{
  "type": "application_private_key",
  "key_id": "84d78592-e3ff-49af-98af-d92ea6599be3",
  "private_key": "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEAtpO4sT6/u3qYnpQoBwj6hnnDgNZVIujpIhVOvsAdq/2tU34c\n7xgGdLE5ea2x1RXiwed6TXXIQ9GJ5JFkPwifR0LHm8RI9MY8ep8uLneQwPFusRbP\nSZ2uSPffmZelziFPasSVIWsacrEGgSgxOmpT3EGeBGUFG0rd2PuhqlQRDOSVThnX\n5OSOHLrdQeUdbnGLNF9QMBGECUNRfql3NJRqbU2qoMoyOoaDt2vgiuhKZUbpcRra\nG6QJPw1blN2dvRFmrwq9f9pLbBUgzUWuBSxh2gHiWHdKRcyl0sSRv4Fc9BYxom5C\nABMxvclnjsBq1gtUrBh0ELlpvmJfNENZMFIqrQIDAQABAoIBAByDwr8v8Sr7MTXn\nJr8+iD4Ta1TGZMKQhMS1djh1cczoUDcvhZ5T7sIv4a2e0pzYj7NAD0pkwFPTOImR\nqYnss0+iXuF1jP1pro1qKgDI3Ls9mc+fo903+r3btLjcxeEFM82ViUMQYq+R9VWb\nrOCWNaW7O84s5tjF3xMh7bRX79fG4fWQptQg+U67tHC+6tTOaxPoBQQjHKcw/FHa\n9dT7W1Tt7k3XMVB/unM1N38Vk1bDe3hng6OO5rqnWoqwet0YtHoCLxfufSKk2Pp2\nG7MTW/G2v5ke0ktKKrrwbcIHob88bzWAHPxASlmSzHazucfTJ2zAW88twbG/ffKA\nohIBIgMCgYEA0InxiB/rPJ4p7pe6PIaTxLUhgg3f9WumWZ2ToJ37kQnwAru3W9q9\nWj81FzzFGBCtDbfIAAIEQFoFejXhYO/Cc3SjZxt7W0j8HCHneQhGo30cAHEO1/1y\nHkHbyBpKkM444Vms0xK1E1HntJkVak/C0ozRZX+aYZK++IIJFMueBwMCgYEA4CEr\nqm1gulXV3ui2Bnd17sGxdT2XBPj8wpW1KoOb57mMEgWs7R3rFAMCIhL/SGG2E80o\nYdhul+v4IYxUZmF/LpYdbWyfVvQ3DapnJPa333nBfwOFuVLVjuENlh+u4XxPekd/\nOsUrCAcImkx9KEc7bw283qHjsk6/wjyPtyPuwI8CgYAA8R6OJtbBJ1W5JiZJL7Jr\nKQZFuBpS2XGe5f9Msmn4dbsHyCFD4PEJ/08WE8gwG6MsdLAKj/fE8qMjsiqabXrL\nWrOCO7WK7AF3fw+0lDz9cAs4VUpj31ksmc+MT9IWZVgMbINDUMpQlAYf4rEeEc4n\ndUtc0f64ghkqtiukVGcaUQKBgQDEX6vPlify+zP5K7IYtmBpAeKHE6CXJcTohJ0I\nE+nsvSChxcE+vED09rHOwxBTDfGnJdDk8ensSD7OvhJQ5cm2Oqar8kklubHm0k+v\nDlAKiLZln+NxfcdJeZwa1cW3IODOBYjPKGPMk8UQ1EWwncDQS5wZAITs/Jx9Bezx\njJUqtwKBgAa3eWY0m1OQNI0cZGLK+wDwHTVy+VV/rbKieJUTkeGYhc9VV/eUiaqD\nHSqf8QrcV8RqhZQ1Mof9A8SJ3uRqsvaMIgYemsNzkyvOFPbq1h6xpEZmUCNnLgKe\npgHN9Sdfra6ahoLnxP2H5dliTMeZ8+q9KF4fCIWR3ratmPqh+lhF\n-----END RSA PRIVATE KEY-----\n",
  "public_key": "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtpO4sT6/u3qYnpQoBwj6\nhnnDgNZVIujpIhVOvsAdq/2tU34c7xgGdLE5ea2x1RXiwed6TXXIQ9GJ5JFkPwif\nR0LHm8RI9MY8ep8uLneQwPFusRbPSZ2uSPffmZelziFPasSVIWsacrEGgSgxOmpT\n3EGeBGUFG0rd2PuhqlQRDOSVThnX5OSOHLrdQeUdbnGLNF9QMBGECUNRfql3NJRq\nbU2qoMoyOoaDt2vgiuhKZUbpcRraG6QJPw1blN2dvRFmrwq9f9pLbBUgzUWuBSxh\n2gHiWHdKRcyl0sSRv4Fc9BYxom5CABMxvclnjsBq1gtUrBh0ELlpvmJfNENZMFIq\nrQIDAQAB\n-----END PUBLIC KEY-----\n",
  "application_id": "jOwyvfFaT5Cspjlc9R-yXkTvEEEjqqKu"
}
EOF

chmod 600 /opt/render/.openpaw/secrets/.uber_credentials.json
echo "✓ Uber credentials installed at /opt/render/.openpaw/secrets/.uber_credentials.json"
