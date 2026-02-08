#!/bin/bash
input=$(cat)

CONTEXT_SIZE=$(echo "$input" | jq -r '.context_window.context_window_size')
USAGE=$(echo "$input" | jq '.context_window.current_usage')

if [ "$USAGE" != "null" ] && [ "$CONTEXT_SIZE" != "null" ] && [ "$CONTEXT_SIZE" != "0" ]; then
    CURRENT=$(echo "$USAGE" | jq '.input_tokens + .cache_creation_input_tokens + .cache_read_input_tokens')
    ACTUAL_PERCENT=$((CURRENT * 100 / CONTEXT_SIZE))

    SCALED_PERCENT=$((ACTUAL_PERCENT * 100 / 85))
    if [ "$SCALED_PERCENT" -gt 100 ]; then
        SCALED_PERCENT=100
    fi

    WARNING=""
    if [ "$SCALED_PERCENT" -ge 80 ]; then
        WARNING=" ⚠️"
    fi
    if [ "$SCALED_PERCENT" -ge 95 ]; then
        WARNING=" 🚨"
    fi

    echo "Context: ${SCALED_PERCENT}%${WARNING}"
else
    echo "Context: -"
fi
