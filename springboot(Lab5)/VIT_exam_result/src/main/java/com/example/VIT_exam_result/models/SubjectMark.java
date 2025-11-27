package com.example.VIT_exam_result.models;

import java.io.Serializable;

public class SubjectMark implements Serializable {
    private String name;
    private Double mse;
    private Double ese;
    private Double finalMark;

    public SubjectMark() {}

    public SubjectMark(String name, Double mse, Double ese) {
        this.name = name;
        this.mse = mse;
        this.ese = ese;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getMse() {
        return mse;
    }

    public void setMse(Double mse) {
        this.mse = mse;
    }

    public Double getEse() {
        return ese;
    }

    public void setEse(Double ese) {
        this.ese = ese;
    }

    public Double getFinalMark() {
        return finalMark;
    }

    public void setFinalMark(Double finalMark) {
        this.finalMark = finalMark;
    }
}
