package com.sor.service;

import com.sor.model.Crew;
import com.sor.model.CrewSummary;

import java.util.List;

public interface CrewService extends BaseEntityService<Crew> {

  List<CrewSummary> findSummaries();
}
