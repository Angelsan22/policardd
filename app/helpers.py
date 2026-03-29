from fastapi import Request
from fastapi.templating import Jinja2Templates
from app.security.auth import make_get_flashed

templates = Jinja2Templates(directory="templates")

def render(request: Request, template: str, context: dict | None = None):
    context = context or {}

    def url_for_compat(name: str, **kwargs):
        if "filename" in kwargs:
            kwargs["path"] = kwargs.pop("filename")
        return str(request.url_for(name, **kwargs))

    return templates.TemplateResponse(
        request=request,
        name=template,
        context={
            "request": request,
            "session": request.session,
            "get_flashed_messages": make_get_flashed(request),
            "url_for": url_for_compat,
            **context,
        },
    )