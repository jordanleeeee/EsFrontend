import {EsResponse} from "../types/es";

function QueryResultDisplay(searchResponse: EsResponse) {
    function urlView(url: String): JSX.Element {
        const parts: string[] = url.split('/');
        let formerPart = parts[0] + "//" + parts[2]
        let latterPart = ""
        for (let i = 3; i < parts.length; i++) {
            if (i === 3) latterPart += " > "
            latterPart += parts[i]
            if (i < parts.length - 1) latterPart += " > "
        }

        return (
            <div style={{alignItems: "center", marginRight: "12px"}}>
                <span>{formerPart}</span>
                <span style={{color: "#969ba1"}}>{latterPart}</span>
            </div>
        )
    }

    return (
        <>
            <div>search takes {searchResponse.took}ms, got {searchResponse.hits.total.value} documents</div>
            <br/>
            {
                searchResponse.hits.hits.map(entry => {
                    const document = entry._source;
                    return (
                        <div key={entry._id}>
                            <div style={{display: "flex"}}>
                                <div style={{alignSelf: "center", marginRight: "10px"}}>score: {entry._score.toFixed(4)}</div>
                                <div key={entry._id}>
                                    <div style={{fontSize: '16px', display: "flex"}}>
                                        {urlView(document.url)}
                                        {
                                            document.updatedTime &&
                                            <span style={{marginLeft: "10px"}}>updated at {document.updatedTime}</span>
                                        }
                                    </div>
                                    <a style={{fontSize: '24px', color: "#8ab4f8"}} href={document.url} target={"_blank"} rel="noreferrer">
                                        {document.title}
                                    </a>
                                    <div style={{width: "50vw", fontSize: "18px", marginTop: "5px"}}>
                                        {
                                            entry?.highlight?.["body.content"] !== undefined ?
                                                <div dangerouslySetInnerHTML={{__html: entry.highlight["body.content"][0]}}/> :
                                                <div>{document.body.content.substring(0, 200)}</div>
                                        }
                                    </div>
                                </div>
                            </div>
                            <br/><br/>
                        </div>
                    )
                })
            }
        </>
    );
}

export default QueryResultDisplay;
