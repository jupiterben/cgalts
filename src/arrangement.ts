export class Arr_bfs_scanner {

}

export class Arr_accessor {
    constructor(arr: Arrangement_on_surface_2) {

    }
}


export class Arrangement_on_surface_2 {
    m_topol_traits: any;
    m_geom_traits: any;

    is_empty() {
        return this.m_topol_traits.is_empty_dcel();
    }

    get faces(): any[] { return []; }

    clear() {
        //TODO
    }
}
