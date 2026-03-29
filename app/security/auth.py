from fastapi import Request
from fastapi.responses import RedirectResponse

def flash(request: Request, message: str, category: str = "info"):
    msgs = list(request.session.get("_flashes", []))
    msgs.append([category, message])
    request.session["_flashes"] = msgs

def make_get_flashed(request: Request):
    def get_flashed_messages(with_categories=False):
        msgs = list(request.session.get("_flashes", []))
        request.session["_flashes"] = []
        if with_categories:
            return [tuple(m) for m in msgs]
        return [m[1] for m in msgs]
    return get_flashed_messages

def is_logged_in(request: Request) -> bool:
    return "usuario_id" in request.session

def redirect_login(request: Request, message: str = "Debes iniciar sesion"):
    flash(request, message, "warning")
    return RedirectResponse("/login", status_code=302)
