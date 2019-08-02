import { Arrangement_on_surface_2, Compare_vertex, Join_merge, Arr_entry } from "./arrangement";
import { General_polygon_2, Int } from "./types";

/**
 * 
 */
class Gps_on_surface_base_2 {
    m_arr: Arrangement_on_surface_2;
    /**
     * 将polygon插入arrangment中  polygon必须与arrangement不相交
     * @param pgn 
     * @param arr 
     */
    _insert(pgn: General_polygon_2, arr: Arrangement_on_surface_2) {

    }

    joinPolygons(list: Array<General_polygon_2>, k: Int = 5) {
        const arr_vec = Arr_entry[list.length + 1];
        arr_vec[0].first = this.m_arr;
        for (let i = 1; i < arr_vec.length; i++) {
            const aos2 = arr_vec[i].first = new Arrangement_on_surface_2();
            this._insert(list[i - 1], aos2);
        }
        function _build_sorted_vertices_vectors(arr_vec) {
            arr_vec.forEach((item: Arr_entry) => {
                const vertices = item.first.vertices().slice();
                vertices.sort(Compare_vertex);
            });
        }

        function _divide_and_conquer(lower: Int, upper: Int, arr_vec, k: Int, merge_func) {
            if ((upper - lower) < k) {
                merge_func(lower, upper, 1, arr_vec);
                return;
            }

            const sub_size = ((upper - lower + 1) / k);
            let i = 0;
            let curr_lower = lower;

            for (; i < k - 1; ++i, curr_lower += sub_size) {
                _divide_and_conquer(curr_lower, curr_lower + sub_size - 1, arr_vec, k,
                    merge_func);
            }
            _divide_and_conquer(curr_lower, upper, arr_vec, k, merge_func);
            merge_func(lower, curr_lower, sub_size, arr_vec);
            return;
        }

        _build_sorted_vertices_vectors(arr_vec);

        const merge = new Join_merge();
        _divide_and_conquer(0, arr_vec.length - 1, arr_vec, k, ()=>{merge.});

    }
    remove_redundant_edges() { }
    _reset_faces() { }
}



class General_polygon_set_on_surface_2 extends Gps_on_surface_base_2 {

}
class General_polygon_set_2 extends General_polygon_set_on_surface_2 {
    polygons_with_holes() {

    }

    join(ps1, ps2) {

    }

    intersection(ps1, ps2) { }
    symmetric_difference(ps1, ps2) { }
}

class CircleC2 {

}
//main
