import { Controller, Get } from '@nestjs/common';

/**
 * Sanity-check del backend.
 * GET /api/health -> { ok: true, ... }
 */
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      ok: true,
      service: 'kinepro-api',
      uptimeSeconds: Math.floor(process.uptime()),
      now: new Date().toISOString(),
    };
  }
}
