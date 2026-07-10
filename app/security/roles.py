from fastapi import Request
from fastapi.responses import RedirectResponse

from app.security.auth import flash, is_logged_in


def check_role(request: Request, *roles: str) -> RedirectResponse | None:
    """Verifica sesion y rol para rutas web. Devuelve None si autorizado,
    o un RedirectResponse (con mensaje flash) si no."""
    if not is_logged_in(request):
        flash(request, "Debes iniciar sesion", "warning")
        return RedirectResponse("/login", status_code=302)
    if request.session.get("tipo") not in roles:
        flash(request, "No tienes permisos para acceder a este recurso", "error")
        return RedirectResponse("/", status_code=302)
    return None
