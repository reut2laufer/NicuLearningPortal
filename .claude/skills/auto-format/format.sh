#!/bin/sh
# auto-format dispatcher: picks the right formatter per file extension.
# Usage: format.sh FILE_OR_DIR [...]
# Exits non-zero if any file failed to format or had no known formatter.

fail=0

format_one() {
	f="$1"
	case "$f" in
	*.py)
		ruff format "$f" || fail=1
		;;
	*.sh | *.bash)
		shfmt -w "$f" || fail=1
		;;
	*.json)
		tmp="$f.jqtmp" && jq . "$f" >"$tmp" && mv "$tmp" "$f" || {
			rm -f "$f.jqtmp"
			fail=1
		}
		;;
	*.html | *.css | *.js | *.jsx | *.ts | *.tsx | *.md | *.yaml | *.yml)
		prettier --write "$f" || fail=1
		;;
	*.swift)
		if command -v swiftformat >/dev/null 2>&1; then
			swiftformat "$f" || fail=1
		else
			echo "skip (swiftformat not installed): $f" >&2
			fail=1
		fi
		;;
	*)
		echo "skip (no formatter for extension): $f" >&2
		;;
	esac
}

for target in "$@"; do
	if [ -d "$target" ]; then
		find "$target" -type f \( -name '*.py' -o -name '*.sh' -o -name '*.bash' \
			-o -name '*.json' -o -name '*.html' -o -name '*.css' -o -name '*.js' \
			-o -name '*.jsx' -o -name '*.ts' -o -name '*.tsx' -o -name '*.md' \
			-o -name '*.yaml' -o -name '*.yml' -o -name '*.swift' \) \
			-not -path '*/node_modules/*' -not -path '*/.git/*' |
			{
				while IFS= read -r f; do format_one "$f"; done
				exit $fail
			} || fail=1
	else
		format_one "$target"
	fi
done

exit $fail
