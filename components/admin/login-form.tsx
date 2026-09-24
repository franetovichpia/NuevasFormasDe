"use client";

import { useActionState } from "react";

import {
  login,
  type LoginState,
} from "@/app/admin/actions";

const initialState: LoginState = {
  error: null,
};

export function LoginForm() {
  const [state, formAction, isPending] =
    useActionState(login, initialState);

  return (
    <form
      action={formAction}
      className="mt-6 space-y-4"
    >
      <label className="block">
        <span className="admin-label">
          Usuario
        </span>

        <input
          autoCapitalize="none"
          autoComplete="username"
          className="admin-input"
          name="username"
          required
          type="text"
        />
      </label>

      <label className="block">
        <span className="admin-label">
          Contraseña
        </span>

        <input
          autoComplete="current-password"
          className="admin-input"
          name="password"
          required
          type="password"
        />
      </label>

      {state.error ? (
        <p
          className="rounded-xl bg-nfd-coral/10 px-4 py-3 text-sm text-nfd-coral"
          role="alert"
        >
          {state.error}
        </p>
      ) : null}

      <button
        className="admin-button-primary w-full"
        disabled={isPending}
        type="submit"
      >
        {isPending
          ? "Ingresando…"
          : "Ingresar"}
      </button>
    </form>
  );
}
