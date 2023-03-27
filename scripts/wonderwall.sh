#! /bin/bash

./.wonderwall/wonderwall-master/bin/wonderwall \
  --auto-login=false \
  --upstream-host localhost:8080 \
  --log-level info \
  --bind-address localhost:3000 \
  --ingress http://localhost:3000/stillinger \
  --openid.well-known-url http://host.docker.internal:8233/idporten/.well-known/openid-configuration \
  --openid.client-id local-token-x-client-id \
  --openid.client-jwk '{"p":"1KMmKh85qonPCvMfbIyDbaSWeeBuMgJ3ISlLwV768PMR3vyFmaahYkAwRlG2QvDG4c4UDzqroaWlZ_5REC4M0oMFlWvZ6N4raWKteqyUxFChjDMpsFj1o_i4XYkPp_rB3ehMVvpVE64EylTe9_E0cLwFir82xA6pP8ho_BC6jtk","kty":"RSA","q":"nvKKaS1AG02qKnlFSYtKxyEXu-6sJr8GdSO0IYgvxBIboIxXwW14OqFY8aBQTDCrtXCSkwhQyCYwrhBZCpWgFhTedxefKfdzKzB9E4peaymnKOfjX4BaliG_j8z9_yavPOFDgsDdccbb5tqPq6OkCmZpTveIfygaJFc9N1-Fbr8","d":"JRdFU4dUucb8T6_9BR34B9x8zeyZA4vKN0hU2Ne5sf9_uahAsUAxSuQloAUC_I8yVURYC-ldl0RGNtH6FqWYZGaKo-92haOv6KRdHH4--8e44IIz3_3ySrTSskJyW018mP5uj6riCl-NJKCoAR4PfcwHXxj0fTZpdkm0g_ZuQeHyhbccgGO5y4xpFblzxmNv9FOwFtfsmRhdbp4XTtghFmT5y-eK5WhLA2evv_9zZRwgpp-BKjEqW2vBvEznnHDLGrK2pCtMrLv7VFKeaQlk01jRh-Old0Cola8xRHnPNFRVuGcaJbxbc83kJgPosK7gwMRU1ShOArPEIRcsWMzpwQ","e":"AQAB","use":"sig","kid":"jXDxKRE6a4jogcc4HgkDq3uVgQ0","qi":"k_FPIPmDVCwjxhdNb0zLg16bght6nkGfxPgS57dRslN_eEWy_FJNdDMmRQ17I0XLal-0ciRO4Q3pJg52vPX84y-tmA6OkTo5cbPX9NOhUz5I0bdahGLsBADI8Hod9g-WPw9peIaF9K1U335j_-M4Bw-35XL9kfFExrv28Ael594","dp":"h4LqAZIgyARHRG0oq57o62km1MkosQpNLX8J3lRPjFr8GqXH5uIAm4LYwRe2FfcoaCNTOVlkpAHS5fF3a95NIaOKXW18VCGyfNj8Qd_Wdz4DljvM56vp7_PEWyfMKHtwLaGrdQrYSVBvkRqBdnXru6S3y3KMzmmhhxqLfYiTvBE","alg":"RS256","dq":"fkdNRaBItShv0AzGylYa07dr5sgJB0NuuvPhsV5ELK8COfwl4Cu7gEEdq-HkyZNFaAIGwT-zBkCpHjEovKsBI2nzEIS41Bue6So9xJ-Cwfq2rl4Em6Qa0_n9-h4vkV3HjUOeYiweAr2tiWwNBp0cv5J7idxJGlTe6A5TOUHvfXs","n":"hAYmv2IqZQzSGTK7RixXgl7yEu3MgG2kuK4inAK0cSOseyIgDj_-X9ihkQb-aLMRW82vlTyypaZsYf9025EzI4YTnHoOMoerMLkrcqvKTZ8ujcCMLr4gfR-b_Wbl4oV6DkegiWQwIA6QjFgMe403nSnzXPBPgVjpUYV2Jr_n3fi5tjEwr07sX5ij9j6w3OW1aJMTToTmJUdlkS2S4ny9V5LVQD-5P9vGFpNUMaOcJw7lXiG1eQV8fcfrkUmN2jSa5A3kAniVsvrZGQ-QbzsC8IvZGVfiVvqv_G7KoJDYqJUBYZJVRAwbdHOStNsEMcmmyb2f8xsvH23kqfTOYk7R5w"}' \
  --openid.post-logout-redirect-uri http://localhost:3000/stillinger \
  --redis.address localhost:6379 \
  --redis.tls=false
