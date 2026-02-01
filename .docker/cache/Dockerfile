FROM redis:7-alpine

LABEL maintainer="portfolio-dev"
LABEL description="Redis 7 Alpine container for Portfolio project development"
LABEL version="1.0.0"

ENV REDIS_PASSWORD=password \
    TZ=UTC

COPY redis.conf /usr/local/etc/redis/redis.conf

RUN chmod 644 /usr/local/etc/redis/redis.conf && \
    mkdir -p /data && \
    chown -R redis:redis /data && \
    chmod 755 /data

EXPOSE 6379

HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD redis-cli -a "${REDIS_PASSWORD}" ping || exit 1

CMD ["redis-server", "/usr/local/etc/redis/redis.conf"]
