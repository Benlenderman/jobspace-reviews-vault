import { FastifyInstance, FastifyError, FastifyRequest, FastifyReply } from 'fastify';

export async function errorHandler(app: FastifyInstance): Promise<void> {
  app.setErrorHandler(
    (error: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
      const sanitizedUrl = request.url.replace(/token=[^&]+/g, 'token=***');
      console.error(`Error on ${request.method} ${sanitizedUrl}:`, {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
      });

      if (error.validation) {
        return reply.code(400).send({
          error: 'Validation error',
          details: error.validation,
        });
      }

      if (error.statusCode === 413) {
        return reply.code(413).send({
          error: 'File too large',
          details: 'Maximum file size is 200MB',
        });
      }

      const statusCode = error.statusCode || 500;
      reply.code(statusCode).send({
        error: error.message || 'Internal server error',
      });
    }
  );
}
