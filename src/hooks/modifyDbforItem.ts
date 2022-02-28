
export default function modifyDbforItem(t_kid: string, t_iid: string, hd: Function, cb?: Function) {
    db.opus.where(':id').equals(query_id).modify(item => {
        item.theKeyWord.forEach(item => {
            if (item.kid === t_kid) {
                item.data.forEach(it => {
                    if (it.iid === t_iid) hd(it);
                })
            }
        })
    }).then(() => {
        if (cb) cb();
    })
}