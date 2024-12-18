const fs = require('fs');
const express = require('express');
const cors = require('cors');
const database = require('./Schema/database.js');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken'); 
const User = require('./Schema/User');
const { Server } = require("socket.io"); 
const connection = require('./Controller/Chat.js');
require('dotenv').config();

database(); 

const JWT_SECRET = process.env.JWT_SECRET || "189ac7bcf390094e24315f5302e07ed2d4853d27cbb3f7bdaf532f86d8025fecf3079c8fbcaa1d4166dbd783d84c1a4512e1a89810f77f7ada0a0a39e343ccfb31c066aa9d1dda3fd13f1354425745a7708cfcb6ec94109336327d0797a1e30ace0b77f82be6f1782d96ff1785e3bfe4896e24a480b02129e4ef3076bcf47d9c3bc3f0811550392eed1664ca57c47368ed48f77e9faf124ac517f51015669e9f031b5bf8fbc92a5ca12abb6133b72e0423e1538d5b31fa2209140d6594be451b6bef2da76ccb60d844cdf84a0f303f2b853de19574688a4ada6b9120556ebbd413fcbd7c26c5e7952477dc4b5348124da0c1a5cfd41ef4a8d446c771c70b820f"
;
const PORT = process.env.PORT || 3001;
let privateKey=`-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDC8qIusR+BE6ax
xIMR/pKsutdxMXlUEpihFIy9PpTEFzbVqKTucCfkZdBqgJ6Ify3IZ0mbUcxq7Zcq
l4FxPGnh9nMov4hyDkWH3dKHVczm6kxPYtfr4lejq80blMR5FTMhKI6qQ4TA2mxT
9BwYyS8f0Luwcny2lwzlmpqvqo5u6/fPpF2YiLfZDYxp19MIs8A+daTnq2cXVAED
+2RBYjtsZlQjgFSTdoNi79HszvVkqCG0NZZrVDaA89Ohz7dHzQ1vkuiXOKtyfkGv
3pvjSPAden7EMX5Gzsg+DOKK2bwi1NohcjpPQaOWxvKHL0OZHm6NheVW+G2TWkGx
HO6ds/1bAgMBAAECggEABnOSzsUZe/iOA4OzgLoc2YQvaAq771PUOD8erzlDIWrR
QOiIA29eapkR+MxRMsbertX4N3XRXtfbsP2lkNKagG9a/UYQD7zi1oMOmgr1W85K
KzW5W+WNgphHZ+UYTBeEWHxn8uuGw6kW0lUZmZpi1FngiY99tWncnpFAvZUr3zDM
zu29390rdpkw1deJ/knwpDjat850ubUm5tHzOVaTSp9Sk6zYPDSmEIfL5KEXRbzi
WfkU9VFYLQiXeA1DM5SX9+D0CRHPLXp6ch+K8RtooqmybqIBs053rt9g38xNOocV
33/8Vk/rO21oiQa81ekWxOlAJVOzSVo0AizRTRIqxQKBgQDkhEzzK14ny6hZcdD9
Ljk6jGAzjSH1aVSb8+gslp5w8WresuU6cBijXmAXSKvXCDMk5DIBkSfG0fc6RrTn
UuXtROcTAEsw7cQOcSwlaF/WbHVtTTly6o91yXrlfZ9zju5IKDoJC+4G+slW+i4f
7uPBFdh5ZY6eXhxeegGPMdmuvwKBgQDaZMq9gtwl9yquSvEn6JyGWGqX0Hk12wXp
xxZhKXXpTcLWSdwriuDNzKsQOdQBwfgOR29MGFKzRgBqTTpWW+TCWeUSeUKNoEAo
+8Ws4H99G8iGOOOp3XoLz2Q9enf+UGLuwl6Dp/sed4VLUFdXZ/sOBVFs+f0z/BME
hAcc3Lz0ZQKBgEjAukL8/qgK1dlMPC4vBjdWs9YVy8b3NuHD4Jo5hc4NfmnSaNqX
D7ELfepLz7HRQX8wS59mGFTbSiu6kSPIp71Hn43UHRxBxpaWf2iVd1WsCCK5YF3u
wafNcpwXx6khy0kbzYZNzwVX2LwhQIgYJVi23MmhhKt06PFHRLHTPCu/AoGAD0Mj
+AKBKBYR4YRTPhq/dZQQPvPOxLi9vQywv7GKD/fjOd6HiHN4Kmm3OrcP3d+UWksb
uBGrFeQ6ezNSdF6PqhVmMNhQkl00nqiZs+8sea3LYbXwExrrQJAJzVIVuKwdfdoP
iNvgbMylgBHpSK53mQ8+FYOS8mMXYSVo6ddzTRECgYAgo96QSLKg+feyRsiTKSSj
2Op2ENcRuZbpTGjaPbUgX3kuWwpD1c+VYyoPrKX7BFD2fiXEJcAadeXsN5njYaN2
Tj5xJQt1cqLP2QdBm5fzLkCLoyuE1sK5eLDtSXJyFH0mTJdHXhyt+eySx6Lj97fL
rLZDhZGdr6cHw+xpPjl7Qw==
-----END PRIVATE KEY-----
`
let certificate=`-----BEGIN CERTIFICATE-----
MIIDlTCCAn2gAwIBAgIUG7jO/d9d3E5I5WWzpbVBxCh3M9EwDQYJKoZIhvcNAQEL
BQAwczELMAkGA1UEBhMCSU4xCzAJBgNVBAgMAlVQMRIwEAYDVQQHDAlHb3Jha2hw
dXIxEjAQBgNVBAoMCU15Q29tcGFueTEvMC0GA1UEAwwmd3d3LmNoYXQtYXBwbGlj
YXRpb24tMHA5aC5vbnJlbmRlci5jb20wHhcNMjQxMjE4MDEwODA4WhcNMjUxMjE4
MDEwODA4WjBzMQswCQYDVQQGEwJJTjELMAkGA1UECAwCVVAxEjAQBgNVBAcMCUdv
cmFraHB1cjESMBAGA1UECgwJTXlDb21wYW55MS8wLQYDVQQDDCZ3d3cuY2hhdC1h
cHBsaWNhdGlvbi0wcDloLm9ucmVuZGVyLmNvbTCCASIwDQYJKoZIhvcNAQEBBQAD
ggEPADCCAQoCggEBAMLyoi6xH4ETprHEgxH+kqy613ExeVQSmKEUjL0+lMQXNtWo
pO5wJ+Rl0GqAnoh/LchnSZtRzGrtlyqXgXE8aeH2cyi/iHIORYfd0odVzObqTE9i
1+viV6OrzRuUxHkVMyEojqpDhMDabFP0HBjJLx/Qu7ByfLaXDOWamq+qjm7r98+k
XZiIt9kNjGnX0wizwD51pOerZxdUAQP7ZEFiO2xmVCOAVJN2g2Lv0ezO9WSoIbQ1
lmtUNoDz06HPt0fNDW+S6Jc4q3J+Qa/em+NI8B16fsQxfkbOyD4M4orZvCLU2iFy
Ok9Bo5bG8ocvQ5kebo2F5Vb4bZNaQbEc7p2z/VsCAwEAAaMhMB8wHQYDVR0OBBYE
FIdQyUt+hU/PP9CkgGUkryDHKLZbMA0GCSqGSIb3DQEBCwUAA4IBAQC4BDrSTbtH
rHYn1WGgBDzyzMZQ7KqNrfi9rsEBWBzVBWvWxBIorT754UlXkUOqQjBJOfBhaRAa
jTPMmu0yug84AUG67R+q7Xt4vn3xFIVItDa8SWgRXCIguX16aWq8eaiGZFyj/MhW
B8Ypj1yYcodq3x2D2kBN3VDHr3jbKVPyoYotxkvNHm1PkaD1I7hqaT1skOmz1rJP
3LWkkr53id59m6H77REwj0/uYwroRunmO058N2oPjpxBto0D4EOqs30Ub/kBA4fy
YI7pT/57jVHyitiVbg2wuwttUgpKtUv+rvGSRe0CwEmiwLsaMjJJS9BaaJX/cjSx
0ccvqnLsvqHH
-----END CERTIFICATE-----
`;
let ca=`-----BEGIN CERTIFICATE-----
MIIGoDCCBIigAwIBAgIUdFqDNBpB0XVvfOxaSCdtTLzIlkQwDQYJKoZIhvcNAQEL
BQAwgecxCzAJBgNVBAYTAklOMQswCQYDVQQIDAJVUDERMA8GA1UEBwwIbWlyemFw
dXIxLzAtBgNVBAoMJnd3dy5jaGF0LWFwcGxpY2F0aW9uLTBwOWgub25yZW5kZXIu
Y29tMS8wLQYDVQQLDCZ3d3cuY2hhdC1hcHBsaWNhdGlvbi0wcDloLm9ucmVuZGVy
LmNvbTEvMC0GA1UEAwwmd3d3LmNoYXQtYXBwbGljYXRpb24tMHA5aC5vbnJlbmRl
ci5jb20xJTAjBgkqhkiG9w0BCQEWFmF2YW5zaW5naDA4NUBnbWFpbC5jb20wHhcN
MjQxMjE4MDAyODIwWhcNMjcwOTE0MDAyODIwWjCB5zELMAkGA1UEBhMCSU4xCzAJ
BgNVBAgMAlVQMREwDwYDVQQHDAhtaXJ6YXB1cjEvMC0GA1UECgwmd3d3LmNoYXQt
YXBwbGljYXRpb24tMHA5aC5vbnJlbmRlci5jb20xLzAtBgNVBAsMJnd3dy5jaGF0
LWFwcGxpY2F0aW9uLTBwOWgub25yZW5kZXIuY29tMS8wLQYDVQQDDCZ3d3cuY2hh
dC1hcHBsaWNhdGlvbi0wcDloLm9ucmVuZGVyLmNvbTElMCMGCSqGSIb3DQEJARYW
YXZhbnNpbmdoMDg1QGdtYWlsLmNvbTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCC
AgoCggIBAKnIBgiy5Sat6h1JPAdIIYKSmHe5kQE8PZhsU6ZCzq5NM96V6J5pz2Fh
/jUxC/l5SYTzSpazxTayjEejhYypY0wQRVsuIkAv6MnZFfejtaULFrYQGFVmqapT
S3a2i8sZZEzesYIHhIdIQgNCY7li8c99LAsXCvbC8HiL4TcyGwT65mqftrn2mrY9
sQKxuljmSY7qbfAkpPWPGQIoFqB5WP8djAWcvkyjyAkmWZDXRxliev2FVROK9SZj
U16LC3441eLFdOfwMwv3Mdh4nQ7UrvOvBQFq4meDhd1slaNok0zIEuTs+QCV941o
x7EnsldagWVh1U0UXo39QooeUEyiAjcUkXnLQACKY5r6RJ8F8yj/PUTvqPIRHCbj
qBpSAclijWK6gqlHht7WeT9SGQUxfhVbZT09gGdqtWjaxwqP0F43j+0v2QLiUzG7
aVuTG8sOSGUGLExYAJdmBZFd1ZH4wijYdkRgKUF8TBagXIyozuJbfZPgVz/zgZmq
aMkSnI7tzylud5pGTqUY8wr94mxXLqKyI/bULmo1utTwzKdYDYpp9r8iDTDKfXW4
lcpMRHLu5NzFJL/22fnNBn/B9E5tsagzre73lkJHM/uaJskn8GqMSqhyQGAaW4VN
pQwbNWfD6KDEzIUkpXR5+9f1tMQ5cqSZVPAK9uA1nyV8BgompFSzAgMBAAGjQjBA
MB0GA1UdDgQWBBSxLSlSlrZm6eyM3FNNmVoZ5rcXhjAfBgNVHSMEGDAWgBRwvOdc
lNAIZdaYrJuwaf3eFgjt3jANBgkqhkiG9w0BAQsFAAOCAgEARhkwamtEk1rSdh0D
hes4xPO8I++9+sRsvCMhAhJD/tEmD3fegESwPo2eNSv/Xjcw8Ys0AvBGquQ1dp/h
q71MkzH82ppkeoGonoa34gbkiMIgyz6B5Log/MWTNDkL1mcsjmtEXkRU09WXyrm1
Qvlma9LuZ5gMow2X+5t6dY9Y4dhFwdcLcSh4QPREzifrsyD0vgxCHUc/ETD7jgFb
hQU1ZH1ojtfbnTPe34pOsXM1aeliBMAg37tdZ28zw5AxiIV3hnzYaEqbh4gYQwa2
Myw7J+8BpSNV9UFDFalsVrU4bgeKvBulSWR6nQ50vLuKMIJp/ofWzg/UVTPnj7Y1
4sNxcsaIy7vlIsYzQbN4CkmCQwpYjL3aPAHHtZHKBVFLju3l3o2VPd+2dM3fx6cW
OSTPLR+RL90cCgqqHruKSEsyQNGQB8t1F0gPcrpWXO6X1jGxAsuBQVK3wi6JmM5t
5YxqSXVHlb+hMZO+PX1dX4KQQrZqE5xA2vnWm18JRDx/PFwct2ZG32+dVDjQaU41
I8+PGscCCGRjsIXQteRVH6rPOyDkN30MuuGpNZkmeSJCikl9AtsT3loKvoUAPgWb
msw9jERyi4cz3WwLQ41YVpUBM2seL/NeSZQNjLzQfpoVayDEsZvYHEaKG6xgZhGz
ksEgWJ8Ugavm4T9sQ2esc+xOQWI=
-----END CERTIFICATE-----
`
const app = express();
const httpsServer = require("https").createServer({
    key: privateKey,
    cert: certificate,
    ca: ca,
}, app);
const io = new Server(httpsServer, {
    cors: {
        origin: "https://chat-application-0p9h.onrender.com",
        methods: ["GET", "POST"]
    }
});

app.use(cors({ 
    origin: "https://chat-application-0p9h.onrender.com", 
    methods: ["GET", "POST"], 
    credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { login, sign_up, tokenverify } = require('./Controller/verification.js');
const { addContact, append_message, upload, uploadFile } = require('./Controller/Operation.js');

app.post('/login', login);
app.post('/sign_up', sign_up);
app.post('/addContact', addContact);
app.post('/append_message', append_message);
app.post('/upload/file', upload.single('file'), uploadFile);
app.post('/upload/photo', upload.single('photo'), uploadFile);

let users = {};
io.on('connection', connection);

// Start the server
httpsServer.listen(PORT, () => {
    console.log(`Secure server is running on https://localhost:${PORT}`);
});
