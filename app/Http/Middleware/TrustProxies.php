<?php

namespace App\Http\Middleware;

use Illuminate\Http\Middleware\TrustProxies as Middleware;
use Illuminate\Http\Request;

class TrustProxies extends Middleware
{
    /**
     * The trusted proxies for this application.
     *
     * @var array<int, string>|string|null
     */
    protected $proxies = '*';
    // '*' = trust the platform's reverse proxy / load balancer (EthioDeploy,
    // Nginx, Cloudflare...). Without it Laravel sees every request as plain
    // HTTP, so asset()/route() build http:// image URLs on an https:// page.
    // iPhone Safari blocks those as mixed content, so downloads fail with
    // "could not reach the server".

    /**
     * The headers that should be used to detect proxies.
     *
     * @var int
     */
    protected $headers =
        Request::HEADER_X_FORWARDED_FOR |
        Request::HEADER_X_FORWARDED_HOST |
        Request::HEADER_X_FORWARDED_PORT |
        Request::HEADER_X_FORWARDED_PROTO |
        Request::HEADER_X_FORWARDED_AWS_ELB;
}
