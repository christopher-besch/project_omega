from app.models import Citation
from typing import List, Optional
from app.models import Source, Citation


def get_text(source_ref: str,
             page: Optional[int] = None,
             line: Optional[int] = None):
    source = Source.query.filter_by(ref=source_ref).first()
    citation = Citation(
        page=page,
        line=line
    )
    citation.set_source(source)
    return citation


def get_video(source_ref: str,
              time_stamp_hour: Optional[int] = None,
              time_stamp_minute: Optional[int] = None,
              time_stamp_second: Optional[int] = None):
    source = Source.query.filter_by(ref=source_ref).first()
    citation = Citation(
        time_stamp_hour=time_stamp_hour,
        time_stamp_minute=time_stamp_minute,
        time_stamp_second=time_stamp_second
    )
    citation.set_source(source)
    return citation
