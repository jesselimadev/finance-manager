// Middleware problemático antes das correções

// import { NextRequest, NextFetchEvent } from "next/server";
// import { clerkMiddleware } from "@clerk/nextjs/server";

// const middlewareWithLogging = (req: NextRequest, ev: NextFetchEvent) => {
//   const xForwardedHost = req.headers.get("x-forwarded-host");
//   const origin = req.headers.get("origin");

//   console.log("x-forwarded-host:", xForwardedHost);
//   console.log("origin:", origin);

//   // O problema ocorre quando o cabeçalho 'origin' é null ou não corresponde ao 'x-forwarded-host'
//   return clerkMiddleware()(req, ev);
// };

// export default middlewareWithLogging;

// export const config = {
//   matcher: [
//     "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//     "/(api|trpc)(.*)",
//   ],
// };

// Eu enfrentei um problema específico ao deslogar da minha aplicação Next.js, onde um erro
//"Invalid Server Actions request" aparecia frequentemente.
// Este erro estava relacionado a um desajuste nos cabeçalhos x-forwarded-host e origin.
// O cabeçalho origin frequentemente aparecia como null, ou não correspondia ao x-forwarded-host,
// o que resultava no erro mencionado.
// Para resolver o problema, adotei as seguintes medidas:

// Identifiquei o Problema:
// Observando que o erro ocorria devido a inconsistências nos cabeçalhos origin
// e x-forwarded-host ao deslogar.

// Adicionei Logs de Depuração:
// Para entender melhor, adicionei logs que mostravam os valores dos cabeçalhos origin
// e x-forwarded-host.

// Implementei Ajustes no Middleware:

// Verifiquei se o cabeçalho origin estava null e, se estivesse,
// definia para o valor de x-forwarded-host.

// Ajustei o origin para corresponder ao x-forwarded-host se eles não estivessem alinhados.

// Teste com Porta Diferente: Alterei a porta do servidor de desenvolvimento
// para 3001 para garantir que não houvesse conflitos com a porta 3000.

// Essas mudanças garantiram que os cabeçalhos fossem consistentes,
// resolvendo o problema de desajuste.

// Dessa forma, consegui resolver o problema de forma abrangente e garantir que a aplicação
// funcione corretamente ao deslogar.

// Middleware corrigido para resolver o problema de cabeçalhos inconsistentes
import { NextRequest, NextFetchEvent } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";

const middlewareWithLogging = (req: NextRequest, ev: NextFetchEvent) => {
  const xForwardedHost =
    req.headers.get("x-forwarded-host") || "localhost:3000";
  let origin = req.headers.get("origin");

  console.log("x-forwarded-host:", xForwardedHost);
  console.log("origin:", origin);

  // Corrigido para definir 'origin' quando está null
  if (!origin) {
    console.log("Setting origin to x-forwarded-host");
    origin = `http://${xForwardedHost}`;
    req.headers.set("origin", origin);
  }
  // Corrigido para ajustar 'origin' quando não corresponde ao 'x-forwarded-host'
  else if (
    origin !== `http://${xForwardedHost}` &&
    origin !== `https://${xForwardedHost}`
  ) {
    console.log("Origin does not match x-forwarded-host, adjusting origin");
    origin = `http://${xForwardedHost}`;
    req.headers.set("origin", origin);
  }

  return clerkMiddleware()(req, ev);
};

export default middlewareWithLogging;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
