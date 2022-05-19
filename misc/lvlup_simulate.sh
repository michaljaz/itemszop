curl -X POST \
	-H "Authorization: Bearer $LVLUP_SANDBOX_TOKEN" \
	-o /dev/null -w '%{http_code}\n' -s \
	https://api.sandbox.lvlup.pro/v4/sandbox/wallet/up/$1/ok
