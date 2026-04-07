package cz.hostingcentrum.Controller;

import cz.hostingcentrum.DTO.PlanDto;
import cz.hostingcentrum.Model.Plan;
import cz.hostingcentrum.Repository.PlanRepo;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class PlanController {

    private static final Logger log = LoggerFactory.getLogger(PlanController.class);
    private final PlanRepo planRepo;

    @GetMapping("/api/v1/plans")
    public ResponseEntity<List<PlanDto>> getAllPlans() {
        List<PlanDto> dtos = planRepo.findByIsActiveTrueOrderByDisplayOrderAsc().stream().map(this::toDTO).toList();
        log.info("Returning {} hosting plans", dtos.size());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/api/v1/plans/{id}")
    public ResponseEntity<PlanDto> getPlanById(@PathVariable Long id) {
        return planRepo.findById(id).map(plan -> ResponseEntity.ok(toDTO(plan))).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/api/v1/plans/code/{code}")
    public ResponseEntity<PlanDto> getPlanByCode(@PathVariable String code) {
        return planRepo.findByCode(code).map(plan -> ResponseEntity.ok(toDTO(plan))).orElseGet(() -> ResponseEntity.notFound().build());
    }

    private PlanDto toDTO(Plan plan) {
        PlanDto dto = new PlanDto();
        dto.setId(plan.getId());
        dto.setCode(plan.getCode());
        dto.setName(plan.getName());
        dto.setDescription(plan.getDescription());
        dto.setDiskSpaceMb(plan.getDiskSpaceMb());
        dto.setMaxDomains(plan.getMaxProjects());
        dto.setMaxDatabases(plan.getMaxDatabases());
        dto.setMaxFtpAccounts(plan.getMaxFtpAccounts());
        dto.setMaxEmailAccounts(plan.getMaxEmailAccounts());
        dto.setPriceMonthly(BigDecimal.valueOf(plan.getPriceMonthly()));
        return dto;
    }
}
