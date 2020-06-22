import { Arrangement_on_surface_2, Arr_accessor } from "./arrangement";


export class Point_2 {

}

export class X_monotone_curve_2 {

}

export class Polygon_2 {

}

export class Polygon_with_holes_2 {

}

export function overlay(arr1, arr2, arr3, functor: any) {

}


export class Gps_join_functor {

}

export class Polygon_Set_2 {
    m_arr: Arrangement_on_surface_2 = new Arrangement_on_surface_2();

    join(polygon: Polygon_2) {
        this._join(polygon);
    }

    _join(polygon: Polygon_2) {
        if (this._is_empty_polygon(polygon)) return;
        if (this._is_plane_polygon(polygon)) {
            this.clear();
            for (let face of this.m_arr.faces) {
                face.set_contained(true);
            }
            return;
        }
        if (this.is_empty()) {
            let arr = new Arrangement_on_surface_2();
            this._insert(polygon, arr);
            this.m_arr = arr;
            return;
        }
        if (this.is_plane()) return;

        const second_arr = new Arrangement_on_surface_2();
        this._insert(polygon, second_arr);
        this._joinArrangement(second_arr);
    }

    is_plane() {
        return this.m_arr.is_empty() && !this.m_arr.faces[0].contained();
    }
    is_empty() {
        return this.m_arr.is_empty() && this.m_arr.faces[0].contained();
    }

    _is_plane_polygon(polygon: Polygon_2) {
        //TODO
        return false;
    }
    _is_empty_polygon(polygon: Polygon_2) {
        //TODO
        return false;
    }

    clear() {
        this.m_arr.clear();
    }

    _joinArrangement(arr: Arrangement_on_surface_2) {
        let result_arr = new Arrangement_on_surface_2();
        overlay(this.m_arr, arr, result_arr, new Gps_join_functor());
        this.m_arr = result_arr;
        this.remove_redundant_edges();
        this.is_valid();
    }

    //讲一个polygon插入arrangement 这个polygon完全包含于arrangement其中的一个face
    _insert(polygon: Polygon_2, arr: Arrangement_on_surface_2) {
        //TODO
        const accessor = new Arr_accessor(arr);
    }

    remove_redundant_edges() {
        this._remove_redundant_edges(this.m_arr);
    }

    _remove_redundant_edges(arr: Arrangement_on_surface_2) {
        //TODO:
    }

    is_valid() {
        //TODO
        return true;
    }
}